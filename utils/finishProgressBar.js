export function finishProgressBar(){
    const bar = document.getElementById("progress_bar");
    bar.style.width = "100%";
    setTimeout(() => {
        bar.style.display = "none";
        bar.style.width = "0%";
    }, 100);
}