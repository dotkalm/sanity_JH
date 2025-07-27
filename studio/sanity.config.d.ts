declare const _default: {
    name: string;
    title: string;
    projectId: string;
    dataset: string;
    plugins: import("sanity").PluginOptions[];
    schema: {
        types: (({
            type: "document";
            name: "about";
        } & Omit<import("sanity").DocumentDefinition, "preview"> & {
            preview?: import("sanity").PreviewConfig<{
                title: string;
                media: string;
            }, Record<"title" | "media", any>>;
        }) | ({
            type: "document";
            name: "artwork";
        } & Omit<import("sanity").DocumentDefinition, "preview"> & {
            preview?: import("sanity").PreviewConfig<{
                title: string;
                subtitle: string;
                media: string;
            }, Record<"title" | "media" | "subtitle", any>>;
        }) | ({
            type: "document";
            name: "press";
        } & Omit<import("sanity").DocumentDefinition, "preview"> & {
            preview?: import("sanity").PreviewConfig<{
                title: string;
                subtitle: string;
                media: string;
                date: string;
            }, Record<"title" | "media" | "date" | "subtitle", any>>;
        }) | ({
            type: "image";
            name: "artworkImage";
        } & Omit<import("sanity").ImageDefinition, "preview"> & {
            preview?: import("sanity").PreviewConfig<Record<string, string>, Record<string, any>>;
        }) | ({
            type: "object";
            name: "videoAsset";
        } & Omit<import("sanity").ObjectDefinition, "preview"> & {
            preview?: import("sanity").PreviewConfig<{
                title: string;
                subtitle: string;
            }, Record<"title" | "subtitle", any>>;
        }) | ({
            type: "object";
            name: "audioAsset";
        } & Omit<import("sanity").ObjectDefinition, "preview"> & {
            preview?: import("sanity").PreviewConfig<{
                title: string;
                subtitle: string;
            }, Record<"title" | "subtitle", any>>;
        }))[];
    };
};
export default _default;
