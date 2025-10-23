import * as THREE from "three";

export class BasicLayer
{
    constructor (inMap, inGL)
    {
        this.map = inMap;
        this.center = [-78.0, 36.0];
        inMap.flyTo({center: this.center});

        this.renderer = new THREE.WebGLRenderer({
            canvas: inMap.getCanvas(),
            context: inGL,
            antialias: false,
            alpha: true
        })
        this.renderer.autoClear = false;
        this.renderer.setClearColor(0x000000, 0.0);

        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();

        this.geometry = new THREE.PlaneGeometry(400000, 400000, 10, 10);
        
        this.texture = this.createTexture();
        this.material = new THREE.MeshBasicMaterial({map: this.texture});

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotateX(-Math.PI / 2.0);
        this.scene.add(this.mesh);
    }


    createTexture()
    {
        // create a 2x2 texture with one point being transparent black
        const texDim = 2;
        const texSize = texDim * texDim;
        let colorBuffer = new Uint8Array(texSize * 4);

        let colorValue = [255,0,0,255];
        let i = 0;
        while (i < texSize)
        {
            if (i == 3)
            {
                colorValue[i] = 0;
            }
            else colorValue[i] = 255;
            
            const offset = i*4;
            colorBuffer[offset] = colorValue[0];
            colorBuffer[offset + 1] = colorValue[1];
            colorBuffer[offset + 2] = colorValue[2];
            colorBuffer[offset + 3] = colorValue[3];

            colorValue[i] = 0;
            i++
        }

        const outTexture = new THREE.DataTexture(colorBuffer, texDim, texDim);
        outTexture.flipY = true;
        outTexture.needsUpdate = true;
        return outTexture;
    }


    updateCamera(inArgs) 
    {
        const scaling = 1.0;
        const modelMatrix = this.map.transform.getMatrixForModel(this.center, 0.0);
        const mainMatrix = new THREE.Matrix4().fromArray(inArgs.defaultProjectionData.mainMatrix);
        const scaledModelMatrix = new THREE.Matrix4().fromArray(modelMatrix).scale(
            new THREE.Vector3(
                scaling,
                scaling,
                scaling
            )
        );

        this.camera.projectionMatrix = mainMatrix.multiply(scaledModelMatrix);
    }


    drawLayer(inGL, inArgs)
    {
        if (this.map)
        {
            this.updateCamera(inArgs);
            this.renderer.resetState();
            this.renderer.render(this.scene, this.camera);
        }
    }
}