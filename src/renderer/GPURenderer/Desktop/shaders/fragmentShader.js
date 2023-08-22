export const fragmentShader = () => {
  return `
    uniform vec3 baseColor;
    uniform sampler2D uTexture;
    uniform sampler2D atlasIndex;
    
    flat varying float vRotation;
    flat varying float vRotationCos;
    flat varying float vRotationSin;
    flat varying vec3 targetColor;
    flat varying float targetAlpha;
    flat varying vec4 tileRect;
    flat varying float tileID;

    #include <logdepthbuf_pars_fragment>

    void main() {
      #include <logdepthbuf_fragment>
      gl_FragColor = vec4(baseColor * targetColor, targetAlpha);

      vec2 uv = gl_PointCoord;
      uv = mix(tileRect.xy, tileRect.zw, gl_PointCoord);

      float mid = 0.5;
      uv = vec2(
        vRotationCos * (uv.x - mid) - vRotationSin * (uv.y - mid) + mid,
        vRotationCos * (uv.y - mid) + vRotationSin * (uv.x - mid) + mid
      );

      gl_FragColor = gl_FragColor * texture2D(uTexture, uv);

    }
`;
};
