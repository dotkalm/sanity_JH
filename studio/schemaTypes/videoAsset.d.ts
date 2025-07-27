export declare const videoAsset: {
    type: "object";
    name: "videoAsset";
} & Omit<import("sanity").ObjectDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        title: string;
        subtitle: string;
    }, Record<"title" | "subtitle", any>>;
};
