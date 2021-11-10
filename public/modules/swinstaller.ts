export default function SWInstall() {
    navigator.serviceWorker?.register('../sw.js');
}
