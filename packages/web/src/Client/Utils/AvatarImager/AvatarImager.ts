const AvatarImager = (figureConfiguration: string, direction: number = 2, actions: string[] = [], frame: number = 0, headOnly: boolean = false) => {
    return new Promise<Base64URLString>((resolve, reject) => {
        const iframe = document.createElement("iframe");
        iframe.src = `${window.location.origin}/game?avatarImager=${encodeURIComponent(JSON.stringify(figureConfiguration))}&&direction=${direction}&&actions=${encodeURIComponent(JSON.stringify(actions))}&&frame=${frame}&&headOnly=${headOnly}`;

        iframe.onload = () => {
            (iframe.contentWindow as any).generateAvatar().then((avatarData: Base64URLString) => {
                iframe.remove();
                resolve(avatarData);
            }).catch((e: any) => {
                iframe.remove();
                reject(e);
            });
        }

        iframe.onerror = () => {
            iframe.remove();
            reject(new Error("Failed to load avatar imager."));
        }

        iframe.style.display = "none";
        document.body.appendChild(iframe);
    });
}

export default AvatarImager;