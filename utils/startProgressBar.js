export function startProgressBar(){
    const bar = document.getElementById("progress_bar");
    bar.style.width = "0%";
    bar.style.display = "block";
    setTimeout(() => {
        bar.style.width = "70%";
    }, 1000);
}
