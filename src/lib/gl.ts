/* Diz se vale a pena rodar shaders: WebGL2 com GPU de verdade.
   Renderização por software (SwiftShader, llvmpipe, "Microsoft Basic Render"...) aparece em
   máquinas sem aceleração e em navegadores headless; ali cada quadro custa centenas de ms de
   CPU, então os efeitos ficam no fallback estático. Testado uma vez e memorizado. */
const SOFTWARE = /swiftshader|llvmpipe|softpipe|software|basic render|mesa offscreen/i;

let cached: boolean | null = null;

export function hasFastGL(): boolean {
  if (cached !== null) return cached;
  cached = false;
  try {
    const gl = document.createElement("canvas").getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    if (gl){
      const dbg = gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = String(gl.getParameter(dbg ? dbg.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? "");
      cached = !SOFTWARE.test(renderer);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch { /* sem WebGL */ }
  return cached;
}
