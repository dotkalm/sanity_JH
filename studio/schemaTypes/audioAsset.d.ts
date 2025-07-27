export declare const audioAsset: {
    type: "object";
    name: "audioAsset";
} & Omit<import("sanity").ObjectDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        title: string;
        subtitle: string;
    }, Record<"title" | "subtitle", any>>;
};
