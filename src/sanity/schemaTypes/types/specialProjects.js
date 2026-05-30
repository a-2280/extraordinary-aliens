import { defineField, defineType } from "sanity"

export default defineType({
    name: "specialProjects",
    title: "Special Projects",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "image",
            title: "Image",
            type: "image",
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: "video",
            title: "Video (optional, plays over image)",
            type: "file",
            options: { accept: "video/*" },
        }),
        defineField({
            name: "bunnyVideoId",
            title: "Bunny video ID (for large videos)",
            type: "string",
            description: "Paste the video's ID from the Bunny Stream library. Takes priority over an uploaded file.",
        }),
    ],
    preview: { select: { title: "title" } },
})
