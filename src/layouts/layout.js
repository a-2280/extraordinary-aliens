import Footer from "@/components/footer";
import Header from "@/components/header";

export default function Layout({ children, headerData, footerData }) {
    return (
        <html lang='en'>
            <body>
                <Header data={headerData} />
                <main>{children}</main>
                <Footer data={footerData} />
            </body>
        </html>
    )
}
