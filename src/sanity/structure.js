import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list"

export const structure = (S, context) =>
    S.list()
        .title("Content")
        .items([
            S.listItem()
                .title("Pages")
                .child(
                    S.list()
                        .title("Pages")
                        .items([
                            S.documentTypeListItem("about").title("About"),
                            S.documentTypeListItem("specialProjectsSettings").title("Special Projects Landing"),
                            S.documentTypeListItem("inquire").title("Inquire"),
                            S.documentTypeListItem("page").title("Homepage"),
                        ]),
                ),
            S.listItem().title("Layouts").schemaType("layout").child(S.documentTypeList("layout").title("Layouts")),
            orderableDocumentListDeskItem({ type: "projects", title: "Projects", S, context }),
            orderableDocumentListDeskItem({ type: "specialProjectsPage", title: "Special Projects", S, context }),

            S.divider(),

            S.listItem()
                .title("Modules")
                .child(
                    S.list()
                        .title("Modules")
                        .items([S.listItem().title("Headers").schemaType("header").child(S.documentTypeList("header").title("Headers")), S.listItem().title("Contact CTA").schemaType("contactCta").child(S.documentTypeList("contactCta").title("Contact CTA")), S.listItem().title("Footers").schemaType("footer").child(S.documentTypeList("footer").title("Footers"))]),
                ),

            S.listItem().title("Tags").schemaType("tag").child(S.documentTypeList("tag").title("Tags")),
            S.listItem().title("Names").schemaType("name").child(S.documentTypeList("name").title("Names")),
            S.listItem().title("Capabilities").schemaType("capabilities").child(S.documentTypeList("capabilities").title("Capabilities")),
            S.listItem().title("Color Swatches").schemaType("colorSwatch").child(S.documentTypeList("colorSwatch").title("Color Swatches")),
        ])
