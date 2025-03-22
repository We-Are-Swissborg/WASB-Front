import { Post } from "@/types/Post";
import { PostCategory } from "@/types/PostCategory";

const getLanguagesFromCategories = (categories: PostCategory[]): string[] => {
    const languageSet = new Set<string>();

    categories.forEach((category) => {
        if (category.translations) {
            category.translations.forEach((translation) => {
                languageSet.add(translation.languageCode);
            });
        }
    });

    return Array.from(languageSet);
};

const getLanguagesFromPosts = (posts: Post[]): string[] => {
    const languageSet = new Set<string>();

    posts.forEach((post) => {
        if (post.translations) {
            post.translations.forEach((post) => {
                languageSet.add(post.languageCode);
            });
        }
    });

    return Array.from(languageSet);
};

export { getLanguagesFromCategories, getLanguagesFromPosts };