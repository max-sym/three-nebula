export const isFloatingPointTextureSupported = () => {
  const canvas = document.createElement('canvas');

  if (window.WebGL2RenderingContext && canvas.getContext('webgl2')) {
    // return false here to test the mobile renderer on desktop
    return true;
  }

  const gl = canvas.getContext('webgl');
  const support = !!gl.getExtension('OES_texture_float');

  canvas.remove();

  return support;
};
