declare module 'alpinejs' {
    interface AlpineInstance {
        start(): void;
    }

    const Alpine: AlpineInstance;
    export default Alpine;
}
