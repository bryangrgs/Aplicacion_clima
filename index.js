require ('dotenv').config()
const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async ()=> {
    const busquedas = new Busquedas();
    let opt;
    do{
         opt = await inquirerMenu();

        switch(opt){
            case 1:
                //Mostrar mensaje
                const termino= await leerInput('Ciuadad/lugar que desea buscar: ');
                
                //buscar los lugares
                const lugares = await busquedas.ciudad(termino);
               
                // seleccionar el lugar
                const id = await listarLugares(lugares);
                if (id == '0') continue;

                const lugarSel = lugares.find( l => l.id == id);
                
                //Guardar en db
                busquedas.agregarHistorial(lugarSel.nombre);
                
                //datos del clima relacionados
                const clima= await busquedas.climaLugar(lugarSel.lat,lugarSel.lng);
                
                // Mostrar resultados/informarcion
                console.clear();
                console.log('\nInformacion de la ciudad\n'.green)
                console.log('Ciudad:',lugarSel.nombre.green);
                console.log('Latitud',lugarSel.lat);
                console.log('Longitud',lugarSel.lng);
                console.log('Temperatura',clima.temp);
                console.log('Temperatura minima', `${clima.min}`.cyan);
                console.log('Temperatura maxima', `${clima.max}`.red);
                console.log('Como se encuentra el clima: ',clima.desc.green)
                break;
                case 2:
                    busquedas.historialCapitalizado.forEach((lugar, i) => {
                        const idx = `${i+1}.`.green;
                        console.log(`${idx}${lugar}`);
                    })
                    break;

        }

        if (opt !== 0) await pausa();

    } while (opt !== 0)

    
}
main(); 