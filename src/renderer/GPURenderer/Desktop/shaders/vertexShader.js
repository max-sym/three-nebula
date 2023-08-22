import { DATA_TEXTURE_SIZE } from '../../common/TextureAtlas/constants';
import { SIZE_ATTENUATION_FACTOR } from '../../common/shaders/constants';

export const vertexShader = () => {
  return `
    uniform sampler2D uTexture;
    //atlasIndex is a 256x1 float texture of tile rectangles as r=minx g=miny b=maxx a=maxy
    uniform sampler2D atlasIndex;

    attribute float size;
    attribute vec3 color;
    attribute float alpha;
    attribute float texID;
    attribute float rotation;

    flat varying float vRotation;
    flat varying float vRotationCos;
    flat varying float vRotationSin;
    flat varying vec3 targetColor;
    flat varying float targetAlpha;
    flat varying vec4 tileRect;
    varying float tileID;

    #include <common>
    #include <logdepthbuf_pars_vertex>

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      targetColor = color;
      targetAlpha = alpha;
      vRotation = rotation;
      vRotationCos = cos(rotation);
      vRotationSin = sin(rotation);

      tileID = texID;
      //get the tile rectangle from the atlasIndex texture..
      tileRect = texture2D(atlasIndex, vec2((tileID + 0.5) / ${DATA_TEXTURE_SIZE}.0, 0.5));

      gl_PointSize = ((size * ${SIZE_ATTENUATION_FACTOR}) / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
      #include <logdepthbuf_vertex>
    }
`;
};
