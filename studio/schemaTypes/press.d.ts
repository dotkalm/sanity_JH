export declare const press: {
    type: "document";
    name: "press";
} & Omit<import("sanity").DocumentDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        title: string;
        subtitle: string;
        media: string;
        date: string;
    }, Record<"title" | "media" | "date" | "subtitle", any>>;
};
