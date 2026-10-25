# Blue Ocean Flats: landing page (vitrine)

Site estático (HTML/CSS/JS puro, sem build). Pronto para GitHub Pages (`.nojekyll` incluído). URL prevista: https://kauan-gattward.github.io/blueoceanflats/

## Fontes dos dados
- Instagram @pousadablueoceann: bio ("Suítes confortáveis e modernas, aceitamos pets, Praia da Concha, Itacaré - BA, (73) 99907-4679"), cerca de 8,3 mil seguidores
- Site oficial blueoceanflats.com: tipos de flat, preços "a partir de", descrições, endereço, e-mail e **todas as fotos**
- Expedia / Hotels.com / Travala: comodidades, 16 quartos, nota 8,8/10 (21 avaliações), distâncias
- KAYAK: nota 8,7/10 (72 avaliações), telefone +55 73 99907-4679, check-in 14h / check-out 11h
- itacare.com.br: "pousada charme", flats com mini cozinha, café baiano e mineiro

## CTA
Todos os botões de reserva levam a https://wa.me/5573999074679 com mensagem pré-preenchida em pt-BR.

## Pontos a confirmar com a pousada
- Café da manhã: o site oficial diz "café incluso, 8h às 10h"; o Expedia diz "8h às 11h, com taxa". No site aparece apenas "Café da manhã".
- Check-in: KAYAK diz 14h, Expedia diz "das 6h às 22h". Usamos 14h, confirmar.
- Os preços "a partir de" vêm do site oficial e podem mudar.
- Distância até o aeroporto de Ilhéus (cerca de 70 km) é aproximada.
- Avaliações: só as notas agregadas, com link para a fonte; nenhum depoimento foi inventado.
- Não há fotos da praia nem do café da manhã nas fontes públicas usadas.

## Limitações do GitHub Pages
- Não é possível enviar cabeçalhos HTTP (CSP via header, `frame-ancestors`, `X-Frame-Options`, `Permissions-Policy`). A CSP vai na tag meta; a proteção contra clickjacking (`frame-ancestors`) não funciona via meta.
