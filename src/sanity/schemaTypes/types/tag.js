import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
    name: "tag",
    title: "Tag",
    type: "document",
    icon: TagIcon,
    fields: [
        defineField({
            name: "name",
            title: "Name",
            type: "string",
            validation: Rule => Rule.required(),
        }),
    ],
    preview: {
        select: { title: "name" },
    },
});
