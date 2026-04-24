export const structure = S =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Pages')
        .schemaType('page')
        .child(S.documentTypeList('page').title('Pages')),

      S.listItem()
        .title('Layouts')
        .schemaType('layout')
        .child(S.documentTypeList('layout').title('Layouts')),

      S.divider(),

      S.listItem()
        .title('Modules')
        .child(
          S.list()
            .title('Modules')
            .items([
              S.listItem()
                .title('Headers')
                .schemaType('header')
                .child(S.documentTypeList('header').title('Headers')),
                S.listItem()
                .title('Footers')
                .schemaType('footer')
                .child(S.documentTypeList('footer').title('Footers')),
            ]),
            
        ),
    ])
