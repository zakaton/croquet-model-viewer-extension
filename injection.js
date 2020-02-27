class Model extends Croquet.Model {
    init() {
        super.init();

        this.subscribe(this.sessionId, "change-orbit", this.orbit);
    }

    orbit() {
        this.publish(this.sessionId, "update-orbit", ...arguments);
    }
}
Model.register();

const modelViewers = Array.from(document.querySelectorAll("model-viewer"));

class View extends Croquet.View {
    constructor(model) {
        super(model);
        this.model = model;

        window.view = this;

        this.url = location.href;

        this.modelViewers = modelViewers;
        this.modelViewers.forEach((modelViewer, index) => {
            modelViewer.removeAttribute("auto-rotate");
            modelViewer.setAttribute("interaction-prompt", "none");
            modelViewer.addEventListener("camera-change", event => {
                const {source} = event.detail;
                if(source == "user-interaction") {
                    const cameraOrbit = modelViewer.getCameraOrbit();
                    this.publish(this.sessionId, "change-orbit", {index, cameraOrbit, url: this.url, viewId : this.viewId});
                }
            });
        });

        this.subscribe(this.sessionId, "update-orbit", data => {
            const {viewId} = data;

            if(viewId !== this.viewId) {

                const {url} = data;
    
                if(this.url == url) {
                    const {index, cameraOrbit} = data;
                    const {phi, theta} = cameraOrbit;
    
                    const modelViewer = this.modelViewers[index];
                    modelViewer.setAttribute("camera-orbit", `${theta}rad ${phi}rad`);
                }
            }
        });
    }
}


if(modelViewers.length > 0)
    Croquet.startSession(`model-viewer-${window.location.href}`, Model, View);