export declare const about: {
    type: "document";
    name: "about";
} & Omit<import("sanity").DocumentDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        title: string;
        media: string;
    }, Record<"title" | "media", any>>;
};
