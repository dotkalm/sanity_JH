export declare const artworkImage: {
    type: "image";
    name: "artworkImage";
} & Omit<import("sanity").ImageDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<Record<string, string>, Record<string, any>>;
};
