/* Shader do fundo do hero: duas faixas de vidro em cada lateral, que ondulam e se torcem,
   nas cores do site (dourado, ouro claro e âmbar), com pulsos de luz e bordas acesas. */

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

/* paleta do site, variando ao longo da faixa: bronze → dourado → ouro claro → âmbar → dourado */
vec3 palette(float k){
  vec3 bronze = vec3(0.42, 0.28, 0.10);
  vec3 gold   = vec3(0.88, 0.75, 0.45);   // #E0BE72
  vec3 light  = vec3(0.95, 0.88, 0.69);   // #F3E1B0
  vec3 amber  = vec3(0.95, 0.66, 0.23);   // #F2A93B
  k = fract(k) * 4.0;
  vec3 c = mix(bronze, gold, smoothstep(0.0, 1.0, k));
  c = mix(c, light, smoothstep(1.0, 2.0, k));
  c = mix(c, amber, smoothstep(2.0, 3.0, k));
  return mix(c, bronze, smoothstep(3.0, 4.0, k));
}

/* uma faixa presa à borda direita do espaço espelhado q: o lado de fora fica sempre
   colado na extremidade da tela; só o lado de dentro ondula, torce e muda de largura */
vec4 ribbon(vec2 q, float t, float seed, float halfW, float scale, float front){
  float y = q.y;
  float tw = y * 1.3 + t * 0.42 + seed * 1.3;                 // torção contínua
  // inclinação própria de cada lado (como na referência), balançando devagar
  bool left = seed > 1.0;
  float slope = (left ? -0.19 : 0.02) * (1.0 + 0.3 * sin(t * 0.22 + seed));
  // a direita "abre" no meio da altura (barriga), como na referência
  float belly = left ? 0.0 : 0.12 * exp(-pow(y - 0.08 * sin(t * 0.3), 2.0) * 3.5);
  // faixa sempre encorpada: curvas grandes e suaves, sem "recolher"
  float W = 0.29
          + slope * y
          + belly
          + 0.12 * sin(y * 1.0 + t * 0.5 + seed)
          + 0.045 * sin(y * 2.2 - t * 0.38 + seed * 1.7);
  W *= scale;
  float wmin = 0.18 * scale;                                  // largura mínima, com transição suave (sem quinas)
  W = 0.5 * (W + wmin + sqrt((W - wmin) * (W - wmin) + 0.003));
  W -= (1.0 - uIntro) * 0.7;     // largura mínima generosa; entra de fora da tela
  float edge = halfW + 0.02;                                  // extremidade da tela (um pouco além)
  float xi = edge - W;                                        // lado de dentro (o que se mexe)
  float d  = q.x - xi;                                        // distância até o contorno interno
  float s  = -1.0 + 2.0 * d / max(W, 0.02);                   // -1 dentro … +1 na borda da tela
  float aa = fwidth(s) * 1.25;
  float cov = smoothstep(-1.0 - aa, -1.0 + aa, s) * step(0.0, W);

  // volume: seção curva de vidro
  float sc = clamp(s, -1.0, 1.0);
  vec3 n = normalize(vec3(sc, 0.35 * sin(tw), sqrt(max(1.0 - sc * sc, 0.0)) + 0.15));
  vec3 Lt = normalize(vec3(-0.55, 0.45, 0.7));                // luz-chave vinda de dentro/cima
  float diff = max(dot(n, Lt), 0.0);
  vec3 H = normalize(Lt + vec3(0.0, 0.0, 1.0));
  float spec = pow(max(dot(n, H), 0.0), 42.0);
  float fres = pow(1.0 - clamp(n.z, 0.0, 1.0), 2.5);

  // DOBRA: uma aresta que percorre a faixa e a divide em dois planos
  float f      = -0.1 + 0.5 * sin(y * 1.7 + t * 0.48 + seed * 2.1); // posição da dobra: curva ao longo da altura
  float fa     = 0.06;                                          // transição macia entre os planos
  float plane  = smoothstep(f - fa, f + fa, s);                 // 0 = plano de dentro, 1 = plano de fora
  float tilt   = 0.5 + 0.5 * cos(tw * 0.8);                     // qual plano pega mais luz muda com a torção
  float planeL = mix(mix(1.0, 0.68, tilt), mix(0.68, 1.0, tilt), plane);
  planeL = mix(1.0, planeL, front);                             // só a faixa da frente tem a dobra
  float crease = exp(-pow((s - f) * 34.0, 2.0));                // fio de luz na aresta
  float shade  = plane * exp(-max(s - f, 0.0) * 5.0) * 0.25 * front; // sombra leve logo depois da dobra

  // contorno interno: um único filete fino
  float px = fwidth(d);
  float fil1 = exp(-pow((d - 0.005) / max(0.0028, px * 1.2), 2.0));

  float lit = smoothstep(-0.4, 1.0, -s);                       // o lado de dentro brilha mais
  float sheen = exp(-pow((s - 0.5 * sin(tw)) * 2.2, 2.0));

  // cor distribuída ao longo do comprimento, correndo com o tempo
  float along = y * 0.2 - t * 0.06 + seed * 0.13 + 0.05 * s;
  vec3 tint  = palette(along);
  vec3 tint2 = palette(along + 0.35);
  float pulse = exp(-pow(fract(y * 0.3 - t * 0.08 + seed * 0.21) - 0.5, 2.0) * 40.0);

  vec3 goldHi = vec3(1.0, 0.90, 0.66);
  vec3 body = mix(vec3(0.025, 0.017, 0.009), tint * 0.45, (diff * 0.85 + 0.1) * planeL);
  vec3 col = body * (1.0 - shade)
           + tint  * sheen * diff * planeL * (0.45 + 0.25 * pulse)
           + goldHi * spec * planeL * 0.6
           + tint2 * fres * (0.22 + 0.5 * lit)
           + goldHi * crease * 0.3 * front
           + goldHi * fil1 * mix(0.35, 0.9, front);

  // vidro denso
  float alpha = cov * mix(0.86, 1.0, clamp(fres + fil1, 0.0, 1.0));

  // brilho suave fora da faixa (bloom), na cor local
  float outside = max(-d, 0.0);
  float glow = exp(-outside * 22.0) * (1.0 - cov) * (0.16 + 0.24 * lit) * (0.8 + 0.6 * pulse);

  return vec4(col * alpha + tint2 * glow * uIntro, alpha);
}

void main(){
  vec2 fc = gl_FragCoord.xy;
  vec2 p = (fc - 0.5 * uRes) / uRes.y;
  float halfW = 0.5 * uRes.x / uRes.y;
  float t = uTime * 0.85;                                       // ritmo fluido

  // fundo: preto-café com um leve calor no centro
  float r = length(p * vec2(0.75, 1.0));
  vec3 c = mix(vec3(0.040, 0.028, 0.019), vec3(0.022, 0.016, 0.012), smoothstep(0.0, 0.85, r));

  // telas estreitas: faixas mais finas, liberando o texto
  float scale = clamp(halfW / 0.89, 0.55, 1.0);

  for (int i = 0; i < 2; i++){
    float side = i == 0 ? 1.0 : -1.0;
    float seed = i == 0 ? 0.0 : 2.7;
    vec2 q = vec2(p.x * side + uMouse.x * 0.03 * side, p.y + uMouse.y * 0.04);
    // duas faixas por lado, presas à borda: a de trás é só volume, larga e apagada;
    // a da frente tem a dobra e o filete de luz
    vec4 back = ribbon(q, t - 1.6, seed + 0.9, halfW, scale * 1.32, 0.0);
    c = c * (1.0 - back.a) + back.rgb * 0.42;
    vec4 front = ribbon(q, t, seed, halfW, scale * 0.86, 1.0);
    c = c * (1.0 - front.a) + front.rgb;
  }

  // centro levemente mais escuro para o texto respirar
  c *= 1.0 - 0.55 * exp(-dot(p * vec2(0.9, 1.6), p * vec2(0.9, 1.6)) * 3.0);
  c *= uIntro;
  c += (hash(fc + fract(t)) - 0.5) / 255.0;                   // dithering contra faixas no gradiente
  outColor = vec4(c, 1.0);
}`;
