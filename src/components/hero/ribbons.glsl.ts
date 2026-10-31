/* Shader do fundo do hero: duas faixas de "vidro escuro" que se torcem nas laterais,
   com reflexo dourado que corre pela superfície e borda âmbar luminosa. */

export const VERT = /* glsl */ `#version 300 es
in vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

export const FRAG = /* glsl */ `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;    // -0.5..0.5, suavizado
uniform float uIntro;   // 0..1 (entrada depois da tela de carregamento)
out vec4 outColor;

float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

/* uma faixa, desenhada sempre na borda direita do espaço espelhado q.
   depth: 1 = faixa da frente, < 1 = faixa de trás (mais para dentro e mais escura) */
vec4 ribbon(vec2 q, float t, float seed, float halfW, float depth){
  float y = q.y;
  float cx = halfW - 0.17 - (1.0 - depth) * 0.34 + 0.24 * y
           + 0.09 * sin(y * 2.1 + t * 0.55 + seed)
           + 0.045 * sin(y * 4.3 - t * 0.8 + seed * 2.0)
           + (1.0 - uIntro) * 0.5;
  float tw = y * 2.3 + t * 0.4 + seed * 1.3;                  // torção ao longo da altura
  float w  = (0.17 + 0.06 * sin(y * 2.9 + t * 0.5 + seed)) * mix(0.75, 1.0, depth);
  float ww = w * (0.24 + 0.76 * abs(cos(tw)));                // a largura visível muda com a torção
  float s  = (q.x - cx) / ww;                                 // -1..1 dentro da faixa
  float aa = fwidth(s) * 1.25;
  float cov = 1.0 - smoothstep(1.0 - aa, 1.0 + aa, abs(s));

  float face = cos(tw);
  float hp    = 0.62 * sin(tw);                               // reflexo largo que atravessa a faixa
  float spec  = exp(-pow((s - hp) * 3.0, 2.0));
  float spec2 = exp(-pow((s + 0.5 * cos(tw * 1.3)) * 10.0, 2.0)); // traço fino e nítido
  float rim   = pow(clamp(abs(s), 0.0, 1.0), 14.0);               // borda acesa mais fina
  float lit   = smoothstep(-0.2, 1.0, s * face / (abs(face) + 0.2)); // um dos lados da borda brilha mais (transição suave)

  vec3 base  = mix(vec3(0.016, 0.011, 0.008), vec3(0.10, 0.065, 0.03), 0.5 + 0.5 * s * sin(tw));
  vec3 gold  = vec3(0.95, 0.75, 0.42);
  vec3 amber = vec3(1.0, 0.60, 0.18);
  vec3 col = base + gold * spec * 0.18 + vec3(1.0, 0.92, 0.75) * spec2 * 0.22 + amber * rim * (0.16 + 0.7 * lit);

  // brilho suave fora da faixa (bloom)
  float outside = max(abs(s) - 1.0, 0.0) * ww;
  float glow = exp(-outside * 40.0) * (1.0 - cov) * 0.16;

  float k = mix(0.3, 1.0, depth);
  return vec4((col * cov + amber * glow) * k, cov);
}

void main(){
  vec2 fc = gl_FragCoord.xy;
  vec2 p = (fc - 0.5 * uRes) / uRes.y;
  float halfW = 0.5 * uRes.x / uRes.y;
  float t = uTime * 0.7;                                        // movimento mais calmo

  // fundo: preto-café com um leve calor no centro
  float r = length(p * vec2(0.75, 1.0));
  vec3 c = mix(vec3(0.040, 0.028, 0.019), vec3(0.022, 0.016, 0.012), smoothstep(0.0, 0.85, r));

  // telas estreitas: as faixas vão mais para fora, liberando o texto
  float push = clamp((1.0 - halfW) * 0.5, 0.0, 0.34);

  for (int i = 0; i < 2; i++){
    float side = i == 0 ? 1.0 : -1.0;
    float seed = i == 0 ? 0.0 : 2.7;
    vec2 q = vec2(p.x * side + push + uMouse.x * 0.035 * side, p.y + uMouse.y * 0.04);
    vec4 back  = ribbon(q, t * 0.8, seed + 3.1, halfW, 0.55);
    c = c * (1.0 - back.a) + back.rgb;
    vec4 front = ribbon(q, t, seed, halfW, 1.0);
    c = c * (1.0 - front.a) + front.rgb;
  }

  // centro levemente mais escuro para o texto respirar
  c *= 1.0 - 0.55 * exp(-dot(p * vec2(0.9, 1.6), p * vec2(0.9, 1.6)) * 3.0);
  c *= uIntro;
  c += (hash(fc + fract(t)) - 0.5) / 255.0;                   // dithering contra faixas no gradiente
  outColor = vec4(c, 1.0);
}`;
