#!/bin/bash

# Couleurs pour chaque donut
declare -A donuts
donuts[donut-sucre]="#F4A460"
donuts[donut-chocolat]="#8B4513"
donuts[donut-rose]="#FFB6C1"
donuts[donut-vanille]="#F5DEB3"
donuts[donut-nutella]="#8B4513"
donuts[donut-caramel]="#CD853F"
donuts[donut-fraise]="#FF69B4"
donuts[donut-cookies]="#D2B48C"
donuts[donut-complet]="#8B6F47"
donuts[donut-sansucre]="#D4AF37"
donuts[donut-fruits]="#DC143C"
donuts[donut-amande]="#D4A574"
donuts[donut-cafe]="#6F4E37"
donuts[donut-pistache]="#93C572"
donuts[donut-matcha]="#7CB342"
donuts[donut-lavande]="#E6E6FA"

# Créer les images
for donut in "${!donuts[@]}"; do
    color="${donuts[$donut]}"
    convert -size 200x200 xc:white \
        -fill "$color" -draw "circle 100,100 170,100" \
        -fill white -draw "circle 100,100 125,100" \
        -shadow 50x3+2+2 \
        "${donut}.png"
    echo "✓ Créé: ${donut}.png"
done

echo "✅ Toutes les images ont été créées!"
