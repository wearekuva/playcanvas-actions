import { minify } from 'terser'

const min = async code => {
    const out = await minify(code)
    console.log(out)
}

min(`// touch-input.js
var TouchInput = pc.createScript('touchInput');
TouchInput.attributes.add('orbitSensitivity', {
    type: 'number', 
    default: 0.4, 
    title: 'Orbit Sensitivity', 
    description: 'How fast the camera moves around the orbit. Higher is faster'
});
TouchInput.attributes.add('distanceSensitivity', {
    type: 'number', 
    default: 0.2, 
    title: 'Distance Sensitivity', 
    description: 'How fast the camera moves in and out. Higher is faster'
});`)