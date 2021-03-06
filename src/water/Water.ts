import { activeConfig } from './../config';
import {
  Color,
  IcosahedronGeometry,
  Mesh,
  ShaderMaterial,
  UniformsLib,
  UniformsUtils,
  Vector2,
} from 'three';
import type { SceneObject } from './../SceneObject';
import frag from './waterFrag.glsl';
import vert from './waterVert.glsl';

export class Water implements SceneObject {
  object3D: Mesh;
  material: ShaderMaterial;

  constructor() {
    this.material = new ShaderMaterial({
      uniforms: UniformsUtils.merge([
        UniformsLib['lights'],
        {
          time: { value: 0.0 },
          resolution: { value: new Vector2() }, // TODO fix
          heightOffsetScale: { value: 0.03 },
          color: { value: new Color() },
          wavesIntensity: { value: 0 },
          wavesSize: { value: 0 },
          wavesSpeed: { value: 0.0 },
          useFresnel: { value: true },
          useTrochoidalWaves: { value: false },
          opacity: { value: 0.0 },
        },
      ]),
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      lights: true,
      // wireframe: true,
    });
    const geometry = new IcosahedronGeometry(1, 150);
    this.object3D = new Mesh(geometry, this.material);
  }

  update(time: number) {
    this.material.uniforms.useTrochoidalWaves.value =
      activeConfig.water.useTrochoidalWaves;
    this.material.uniforms.wavesSpeed.value = activeConfig.water.wavesSpeed;
    this.material.uniforms.opacity.value = activeConfig.water.opacity;
    this.material.uniforms.useFresnel.value = activeConfig.water.useFresnel;
    this.material.uniforms.time.value = time;
    this.material.uniforms.wavesIntensity.value =
      activeConfig.water.wavesIntensity;
    this.material.uniforms.wavesSize.value = activeConfig.water.wavesSize;
    this.material.uniforms.color.value.set(activeConfig.water.color);
    this.object3D.scale.set(
      activeConfig.water.height,
      activeConfig.water.height,
      activeConfig.water.height,
    );
  }
}
