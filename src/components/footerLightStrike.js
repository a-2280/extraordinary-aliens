import { useEffect, useRef } from "react"
import gsap from "gsap"
import { Renderer, Program, Mesh, Triangle, Vec2 } from "ogl"

const CONFIG = {
    baseBloomRadius: 0.26,
    velocityBloomGain: -0.08,
    baseBrightness: 0.3,
    velocityBrightnessGain: 0.35,

    velocitySmoothing: 0.06,
    stretchStrength: 0.25,
    stretchMax: 1.0,

    dispersionBase: 0.062,
    dispersionVelocityGain: 0.08,

    exposure: 0.85,

    driftSpeed: 0.18,
    driftAmplitude: 0.045,

    fadeInDuration: 0.4,
    fadeOutDuration: 0.6,
    fadeOutDurationPending: 0.18,
    fadeHoldThreshold: 0.3,
    fadeDoneThreshold: 0.05,

    idleInputDelay: 0.25,
    idleEnterEasing: 0.4,
    idleExitEasing: 0.15,
    idleDimFactor: 0.10,
    idleBloomFactor: 0.75,
    breathSpeed: 1.6,
    breathAmplitudeBrightness: 0.10,
    breathAmplitudeBloom: 0.06,

    dispAngleMinVelocity: 0.02,
    dispAngleEasing: 0.4,
}

function prefersReducedMotion() {
    if (typeof window === "undefined" || !window.matchMedia) return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function isHoverPointer() {
    if (typeof window === "undefined" || !window.matchMedia) return false
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches
}

const VERTEX = `
attribute vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAGMENT = `
precision highp float;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec2 uVelocity;
uniform float uTime;
uniform float uIntensity;

uniform float uBaseBloomRadius;
uniform float uVelocityBloomGain;
uniform float uBaseBrightness;
uniform float uVelocityBrightnessGain;
uniform float uStretchStrength;
uniform float uStretchMax;
uniform float uDispersionBase;
uniform float uDispersionVelocityGain;
uniform float uDriftSpeed;
uniform float uDriftAmplitude;
uniform float uDispAngle;
uniform float uExposure;

vec3 bump3y(vec3 x, vec3 yoffset) {
    return max(1.0 - x * x - yoffset, 0.0);
}
vec3 spectral_zucconi6(float x) {
    const vec3 c1 = vec3(3.54585104, 2.93225262, 2.41593945);
    const vec3 x1 = vec3(0.69549072, 0.49228336, 0.27699880);
    const vec3 y1 = vec3(0.02312639, 0.15225084, 0.52607955);
    const vec3 c2 = vec3(3.90307140, 3.21182957, 3.96587128);
    const vec3 x2 = vec3(0.11748627, 0.86755042, 0.66077860);
    const vec3 y2 = vec3(0.84897130, 0.88445281, 0.73949448);
    return bump3y(c1 * (x - x1), y1) + bump3y(c2 * (x - x2), y2);
}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;

    vec2 driftedMouse = uMouse + vec2(sin(uTime * uDriftSpeed), cos(uTime * uDriftSpeed * 0.74)) * uDriftAmplitude;

    float aspect = uResolution.x / uResolution.y;
    vec2 p = (uv - driftedMouse) * vec2(aspect, 1.0);

    float vlen = length(uVelocity);
    float vcapped = clamp(vlen, 0.0, uStretchMax);

    float rc = cos(uDispAngle);
    float rs = sin(uDispAngle);
    mat2 R = mat2(rc, -rs, rs, rc);
    vec2 pr = R * p;
    pr.x /= 1.0 + uStretchStrength * vcapped;

    float disp = uDispersionBase + uDispersionVelocityGain * vcapped;
    disp *= 1.0 + 0.18 * sin(uTime * uDriftSpeed * 1.7);

    float radius = uBaseBloomRadius + uVelocityBloomGain * vcapped;

    const int N = 12;
    vec3 col = vec3(0.0);
    for (int i = 0; i < N; i++) {
        float t = (float(i) + 0.5) / float(N);
        float s = (t - 0.5) * 2.0;
        float offset = s * disp;
        float r = length(pr - vec2(offset, 0.0));
        float bloom = smoothstep(radius, 0.0, r);
        col += spectral_zucconi6(t) * bloom;
    }
    col *= uExposure;
    col *= uBaseBrightness + uVelocityBrightnessGain * clamp(vlen, 0.0, 2.0);
    col = vec3(1.0) - exp(-col);

    float a = uIntensity;
    gl_FragColor = vec4(col * a, a);
}
`

function lerp(a, b, t) { return a + (b - a) * t }

export default function FooterLightStrike() {
    const hostRef = useRef(null)

    useEffect(() => {
        if (typeof window === "undefined") return
        if (prefersReducedMotion()) return
        if (!isHoverPointer()) return

        const host = hostRef.current
        if (!host) return
        const trackEl = host.parentElement
        if (!trackEl) return

        let initialized = false
        const state = {
            renderer: null,
            program: null,
            mesh: null,
            canvas: null,
            raf: 0,
            resizeObs: null,
            mouseProxy: { x: 0.5, y: 0.5 },
            qtoX: null,
            qtoY: null,
            lastMouseX: 0.5,
            lastMouseY: 0.5,
            lastT: 0,
            lastInputT: 0,
            smoothVx: 0,
            smoothVy: 0,
            dispAngle: 0,
            idleness: 0,
            intensityTarget: 0,
            intensityCurrent: 0,
            handlePointerMove: null,
            handlePointerEnter: null,
            handlePointerLeave: null,
            pendingEnter: null,
            pendingTarget: null,
        }

        function seedPointer(nx, ny) {
            state.qtoX(nx, nx)
            state.qtoY(ny, ny)
            state.lastMouseX = nx
            state.lastMouseY = ny
            state.smoothVx = 0
            state.smoothVy = 0
            state.dispAngle = 0
            state.idleness = 0
        }
        function onPointerMove(e) {
            const rect = trackEl.getBoundingClientRect()
            if (rect.width === 0 || rect.height === 0) return
            const nx = (e.clientX - rect.left) / rect.width
            const ny = 1.0 - (e.clientY - rect.top) / rect.height
            state.lastInputT = performance.now()
            if (state.pendingEnter) {
                state.pendingTarget.x = nx
                state.pendingTarget.y = ny
            } else if (state.intensityTarget === 0) {
                if (state.intensityCurrent > CONFIG.fadeHoldThreshold) {
                    state.pendingEnter = { x: nx, y: ny }
                    state.pendingTarget = { x: nx, y: ny }
                } else {
                    seedPointer(nx, ny)
                    state.intensityTarget = 1
                }
            } else {
                state.qtoX(nx)
                state.qtoY(ny)
            }
        }
        function onPointerEnter(e) {
            const rect = trackEl.getBoundingClientRect()
            if (rect.width === 0 || rect.height === 0) return
            const nx = (e.clientX - rect.left) / rect.width
            const ny = 1.0 - (e.clientY - rect.top) / rect.height
            state.lastInputT = performance.now()
            if (state.intensityCurrent > CONFIG.fadeHoldThreshold) {
                state.pendingEnter = { x: nx, y: ny }
                state.pendingTarget = { x: nx, y: ny }
            } else {
                seedPointer(nx, ny)
                state.intensityTarget = 1
            }
        }
        function onPointerLeave() {
            state.intensityTarget = 0
            state.pendingEnter = null
            state.pendingTarget = null
        }

        function init() {
            if (initialized) return
            initialized = true

            const renderer = new Renderer({
                alpha: true,
                premultipliedAlpha: true,
                dpr: Math.min(window.devicePixelRatio || 1, 2),
            })
            const gl = renderer.gl
            const canvas = gl.canvas
            canvas.style.width = "100%"
            canvas.style.height = "100%"
            canvas.style.display = "block"
            host.appendChild(canvas)

            const geometry = new Triangle(gl)
            const program = new Program(gl, {
                vertex: VERTEX,
                fragment: FRAGMENT,
                uniforms: {
                    uResolution: { value: new Vec2(1, 1) },
                    uMouse: { value: new Vec2(0.5, 0.5) },
                    uVelocity: { value: new Vec2(0, 0) },
                    uTime: { value: 0 },
                    uIntensity: { value: 0 },
                    uBaseBloomRadius: { value: CONFIG.baseBloomRadius },
                    uVelocityBloomGain: { value: CONFIG.velocityBloomGain },
                    uBaseBrightness: { value: CONFIG.baseBrightness },
                    uVelocityBrightnessGain: { value: CONFIG.velocityBrightnessGain },
                    uStretchStrength: { value: CONFIG.stretchStrength },
                    uStretchMax: { value: CONFIG.stretchMax },
                    uDispersionBase: { value: CONFIG.dispersionBase },
                    uDispersionVelocityGain: { value: CONFIG.dispersionVelocityGain },
                    uDriftSpeed: { value: CONFIG.driftSpeed },
                    uDriftAmplitude: { value: CONFIG.driftAmplitude },
                    uDispAngle: { value: 0 },
                    uExposure: { value: CONFIG.exposure },
                },
                transparent: true,
            })
            const mesh = new Mesh(gl, { geometry, program })

            state.renderer = renderer
            state.program = program
            state.mesh = mesh
            state.canvas = canvas

            const setSize = () => {
                const rect = host.getBoundingClientRect()
                const w = Math.max(1, rect.width)
                const h = Math.max(1, rect.height)
                renderer.setSize(w, h)
                program.uniforms.uResolution.value.set(gl.drawingBufferWidth, gl.drawingBufferHeight)
            }
            setSize()
            state.resizeObs = new ResizeObserver(setSize)
            state.resizeObs.observe(host)

            state.qtoX = gsap.quickTo(state.mouseProxy, "x", { duration: 1.4, ease: "power3.out" })
            state.qtoY = gsap.quickTo(state.mouseProxy, "y", { duration: 1.4, ease: "power3.out" })

            state.handlePointerMove = onPointerMove
            state.handlePointerEnter = onPointerEnter
            state.handlePointerLeave = onPointerLeave
            trackEl.addEventListener("pointermove", onPointerMove)
            trackEl.addEventListener("pointerenter", onPointerEnter)
            trackEl.addEventListener("pointerleave", onPointerLeave)

            state.lastT = performance.now()
            state.lastInputT = state.lastT
            state.lastMouseX = state.mouseProxy.x
            state.lastMouseY = state.mouseProxy.y

            const tick = (tMs) => {
                state.raf = requestAnimationFrame(tick)
                if (document.visibilityState === "hidden") return

                const dt = Math.max((tMs - state.lastT) / 1000, 0.001)
                state.lastT = tMs

                const mx = state.mouseProxy.x
                const my = state.mouseProxy.y
                const rawVx = (mx - state.lastMouseX) / dt
                const rawVy = (my - state.lastMouseY) / dt
                state.lastMouseX = mx
                state.lastMouseY = my
                state.smoothVx = lerp(state.smoothVx, rawVx, CONFIG.velocitySmoothing)
                state.smoothVy = lerp(state.smoothVy, rawVy, CONFIG.velocitySmoothing)

                const vMag = Math.hypot(state.smoothVx, state.smoothVy)
                if (vMag > CONFIG.dispAngleMinVelocity) {
                    const targetAngle = Math.atan2(state.smoothVy, state.smoothVx)
                    let delta = targetAngle - state.dispAngle
                    while (delta > Math.PI) delta -= 2 * Math.PI
                    while (delta < -Math.PI) delta += 2 * Math.PI
                    const angleK = 1 - Math.exp(-dt / CONFIG.dispAngleEasing)
                    state.dispAngle += delta * angleK
                }

                const timeSinceInput = (tMs - state.lastInputT) / 1000
                const idleTarget = Math.min(timeSinceInput / CONFIG.idleInputDelay, 1)
                const idleTau = idleTarget > state.idleness ? CONFIG.idleEnterEasing : CONFIG.idleExitEasing
                const idleK = 1 - Math.exp(-dt / idleTau)
                state.idleness = lerp(state.idleness, idleTarget, idleK)

                const breathSig = Math.sin(tMs * 0.001 * CONFIG.breathSpeed) * state.idleness
                const dimMul = lerp(1, CONFIG.idleDimFactor, state.idleness)
                const bloomMul = lerp(1, CONFIG.idleBloomFactor, state.idleness)
                program.uniforms.uBaseBrightness.value = CONFIG.baseBrightness * dimMul * (1 + breathSig * CONFIG.breathAmplitudeBrightness)
                program.uniforms.uBaseBloomRadius.value = CONFIG.baseBloomRadius * bloomMul * (1 + breathSig * CONFIG.breathAmplitudeBloom)

                const tau = state.intensityTarget > state.intensityCurrent
                    ? CONFIG.fadeInDuration
                    : (state.pendingEnter ? CONFIG.fadeOutDurationPending : CONFIG.fadeOutDuration)
                const intensityK = tau > 0 ? 1 - Math.exp(-dt / tau) : 1
                state.intensityCurrent = lerp(state.intensityCurrent, state.intensityTarget, intensityK)

                if (state.pendingEnter && state.intensityCurrent <= CONFIG.fadeDoneThreshold) {
                    seedPointer(state.pendingEnter.x, state.pendingEnter.y)
                    state.intensityTarget = 1
                    if (state.pendingTarget) {
                        state.qtoX(state.pendingTarget.x)
                        state.qtoY(state.pendingTarget.y)
                    }
                    state.pendingEnter = null
                    state.pendingTarget = null
                }

                program.uniforms.uMouse.value.set(mx, my)
                program.uniforms.uVelocity.value.set(state.smoothVx, state.smoothVy)
                program.uniforms.uTime.value = tMs * 0.001
                program.uniforms.uIntensity.value = state.intensityCurrent
                program.uniforms.uDispAngle.value = state.dispAngle

                renderer.render({ scene: mesh })
            }
            state.raf = requestAnimationFrame(tick)
        }

        function teardown() {
            if (!initialized) return
            initialized = false

            if (state.raf) cancelAnimationFrame(state.raf)
            state.raf = 0

            if (state.handlePointerMove) trackEl.removeEventListener("pointermove", state.handlePointerMove)
            if (state.handlePointerEnter) trackEl.removeEventListener("pointerenter", state.handlePointerEnter)
            if (state.handlePointerLeave) trackEl.removeEventListener("pointerleave", state.handlePointerLeave)

            if (state.mouseProxy) gsap.killTweensOf(state.mouseProxy)

            if (state.resizeObs) state.resizeObs.disconnect()
            state.resizeObs = null

            if (state.renderer) {
                const gl = state.renderer.gl
                const loseCtx = gl && gl.getExtension("WEBGL_lose_context")
                if (loseCtx) loseCtx.loseContext()
            }
            if (state.canvas && state.canvas.parentNode === host) host.removeChild(state.canvas)

            state.renderer = null
            state.program = null
            state.mesh = null
            state.canvas = null
            state.qtoX = null
            state.qtoY = null
            state.intensityCurrent = 0
            state.intensityTarget = 0
            state.smoothVx = 0
            state.smoothVy = 0
            state.dispAngle = 0
            state.idleness = 0
            state.pendingEnter = null
            state.pendingTarget = null
        }

        const io = new IntersectionObserver((entries) => {
            const entry = entries[0]
            if (!entry) return
            if (entry.isIntersecting) init()
            else teardown()
        }, { threshold: 0 })
        io.observe(host)

        return () => {
            io.disconnect()
            teardown()
        }
    }, [])

    return <div ref={hostRef} className='footer-light-strike' aria-hidden='true' />
}
