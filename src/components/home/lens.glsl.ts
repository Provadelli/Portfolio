/* Shader do carrossel-lupa. Para cada pixel da tela calcula qual ponto da faixa de
   imagens aparece ali: no centro a faixa é plana (1:1); depois do "desnível" ela é
   comprimida na horizontal e esticada na vertical, como vista através da borda de uma
   lente. Como a conta é contínua, a imagem se curva enquanto atravessa o desnível.
   Na borda da lente há refração (aberração cromática) e um traço de luz. */

export const LENS_VERT = /* glsl */ `#version 300 es
in vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

export const LENS_FRAG = /* glsl */ `#version 300 es
precision highp float;
precision highp sampler2DArray;
uniform sampler2DArray uTex;
uniform vec2 uView;    // tamanho do canvas em px CSS
uniform float uPx;     // px do dispositivo por px CSS
uniform float uPos;    // posição da faixa (px) no centro da tela
uniform vec2 uCard;    // largura e altura de um card (px)
uniform float uGap;    // espaço entre cards (px)
uniform float uCount;  // quantidade de projetos
uniform float uFlat;   // fração (0..1) da meia-largura que fica plana
uniform float uBend;   // força da compressão nas bordas
out vec4 outColor;

/* mapeamento da lente: d (-1..1 na tela) -> u (posição na faixa, em meias-larguras).
   c = du/dd = quanto a faixa está comprimida naquele ponto (1 = sem compressão) */
float lens(float d, out float c){
  float ad = abs(d);
  if (ad <= uFlat){ c = 1.0; return d; }
  float t = (ad - uFlat) / (1.0 - uFlat);
  c = 1.0 + 2.0 * uBend * t;
  return sign(d) * (uFlat + (1.0 - uFlat) * (t + uBend * t * t));
}

/* cor (pré-multiplicada) do ponto s da faixa, na altura yy */
vec4 strip(float s, float yy, float aa){
  float stepW = uCard.x + uGap;
  float k = floor(s / stepW);
  float lx = s - k * stepW;
  float idx = mod(k, uCount);
  vec2 p = vec2(lx - uCard.x * 0.5, yy);
  float r = 18.0;
  vec2 q = abs(p) - (uCard * 0.5 - r);
  float dist = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  float a = 1.0 - smoothstep(-aa, aa, dist);
  if (a <= 0.0) return vec4(0.0);
  vec2 uv = vec2(lx / uCard.x, 0.5 - yy / uCard.y);
  vec4 c = texture(uTex, vec3(uv, idx));
  return vec4(c.rgb * a, a);
}

void main(){
  vec2 px = gl_FragCoord.xy / uPx;
  float halfW = uView.x * 0.5;
  float x = px.x - halfW;
  float y = px.y - uView.y * 0.5;
  float d = x / halfW;

  float c;
  float u = lens(d, c);
  float t = clamp((abs(d) - uFlat) / (1.0 - uFlat), 0.0, 1.0);
  float sy = 1.0 + 0.3 * smoothstep(0.0, 1.0, t);            // alongamento vertical na borda
  float yy = y / sy;
  float s = uPos + u * halfW;
  float aa = 0.9 * c;

  vec4 m = strip(s, yy, aa);
  vec3 col = m.rgb;
  float ca = (c - 1.0) * 2.4;                                   // refração: R e B escorregam
  if (ca > 0.05){
    float dir = sign(d);
    col = vec3(strip(s + ca * dir, yy, aa).r, m.g, strip(s - ca * dir, yy, aa).b);
  }
  float alpha = m.a;
  col *= mix(1.0, 0.6, pow(t, 1.25));                           // a parte curvada recebe menos luz

  // traço de luz onde começa o desnível e aro da lente perto da borda
  float band = 1.0 - smoothstep(uCard.y * 0.5, uCard.y * 0.62, abs(yy));
  float e1 = (abs(d) - uFlat) * halfW;
  float streak = exp(-e1 * e1 / 5.0) * band;
  float e2 = (abs(d) - 0.94) * halfW;
  float rim = exp(-e2 * e2 / 26.0) * band;
  vec3 warm = vec3(1.0, 0.9, 0.72);
  vec3 tint = d < 0.0 ? vec3(0.35, 0.78, 0.5) : vec3(0.95, 0.4, 0.4);   // verde / vermelho, bem sutis
  float gA = clamp(streak * 0.55 + rim * 0.35, 0.0, 1.0);
  vec3 gC = mix(warm, mix(warm, tint, 0.45), smoothstep(0.0, 1.0, rim / max(streak + rim, 1e-3)));

  // some nas extremidades da tela
  float fade = 1.0 - smoothstep(0.86, 1.0, abs(d));
  vec3 rgb = (col + gC * gA * (1.0 - alpha * 0.4)) * fade;
  float outA = clamp(alpha + gA * (1.0 - alpha), 0.0, 1.0) * fade;
  outColor = vec4(min(rgb, vec3(outA)), outA);
}`;
