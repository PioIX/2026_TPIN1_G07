const selector = document.getElementById('selector-datos');
const selector2 = document.getElementById('selector-datos2');
async function cargarSelect() {
    try {
        let result = await fetch('http://localhost:4000/preguntas')
        let resultado = await result.json()
        console.log(resultado)
        selector.innerHTML = '<option value="">Seleccione una pregunta...</option>';
        selector2.innerHTML = '<option value="">Seleccione un pregunta...</option>';
        for (let i = 0; i < resultado.length; i++) {
            const element = resultado[i];
            selector.innerHTML += `<option value="${element.id_preguntas}">${element.texto_pregunta}</option>`;
            selector2.innerHTML += `<option value="${element.id_preguntas}">${element.texto_pregunta}</option>`;

        };
    } catch (error) {
        console.log("Error al cargar los datos:", error);
    }
}
cargarSelect();