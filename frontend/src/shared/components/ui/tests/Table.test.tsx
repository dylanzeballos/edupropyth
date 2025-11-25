// src/shared/components/ui/tests/Table.test.tsx
import { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '../table';

describe('Table UI components', () => {
  it('renderiza la estructura completa (table, thead, tbody, tfoot, caption) con roles accesibles', () => {
    render(
      <Table data-testid="tabla" className="tabla-custom">
        <TableCaption>Listado de usuarios</TableCaption>

        <TableHeader data-testid="thead">
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Edad</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody data-testid="tbody">
          <TableRow>
            <TableCell>Fabricio</TableCell>
            <TableCell>24</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Alvin</TableCell>
            <TableCell>28</TableCell>
          </TableRow>
        </TableBody>

        <TableFooter data-testid="tfoot">
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>2</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    // Tabla y grupos
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    expect(table).toHaveClass('tabla-custom');

    // thead / tbody / tfoot no tienen roles directos, pero existen en el árbol
    const thead = screen.getByTestId('thead');
    const tbody = screen.getByTestId('tbody');
    const tfoot = screen.getByTestId('tfoot');
    expect(thead.nodeName.toLowerCase()).toBe('thead');
    expect(tbody.nodeName.toLowerCase()).toBe('tbody');
    expect(tfoot.nodeName.toLowerCase()).toBe('tfoot');

    // Caption
    expect(screen.getByText('Listado de usuarios')).toBeInTheDocument();

    // Column headers
    const headerRow = within(thead).getByRole('row');
    const headers = within(headerRow).getAllByRole('columnheader');
    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveTextContent('Nombre');
    expect(headers[1]).toHaveTextContent('Edad');

    // Body rows & cells
    const bodyRows = within(tbody).getAllByRole('row');
    expect(bodyRows).toHaveLength(2);

    const firstBodyCells = within(bodyRows[0]).getAllByRole('cell');
    expect(firstBodyCells).toHaveLength(2);
    expect(firstBodyCells[0]).toHaveTextContent('Fabricio');
    expect(firstBodyCells[1]).toHaveTextContent('24');

    const secondBodyCells = within(bodyRows[1]).getAllByRole('cell');
    expect(secondBodyCells).toHaveLength(2);
    expect(secondBodyCells[0]).toHaveTextContent('Alvin');
    expect(secondBodyCells[1]).toHaveTextContent('28');

    // Footer row & cells
    const footerRow = within(tfoot).getByRole('row');
    const footerCells = within(footerRow).getAllByRole('cell');
    expect(footerCells).toHaveLength(2);
    expect(footerCells[0]).toHaveTextContent('Total');
    expect(footerCells[1]).toHaveTextContent('2');
  });

  it('hace merge de className en elementos internos (TableRow, TableCell, TableHead)', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow className="fila-header-custom">
            <TableHead className="head-custom">A</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="fila-body-custom">
            <TableCell className="cell-custom">B</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const headerCell = screen.getByRole('columnheader', { name: 'A' });
    expect(headerCell).toHaveClass('head-custom');

    const bodyCell = screen.getByRole('cell', { name: 'B' });
    expect(bodyCell).toHaveClass('cell-custom');

    // Verificar class de las filas: obtener su padre <tr> desde la celda
    const headerRowEl = headerCell.closest('tr');
    const bodyRowEl = bodyCell.closest('tr');
    expect(headerRowEl).toHaveClass('fila-header-custom');
    expect(bodyRowEl).toHaveClass('fila-body-custom');
  });

  it('expone refs correctamente (forwardRef) en Table y TableRow', () => {
    const tableRef = createRef<HTMLTableElement>();
    const rowRef = createRef<HTMLTableRowElement>();

    render(
      <Table ref={tableRef}>
        <TableBody>
          <TableRow ref={rowRef}>
            <TableCell>Item</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(tableRef.current).toBeInstanceOf(HTMLTableElement);
    expect(rowRef.current).toBeInstanceOf(HTMLTableRowElement);
  });
});
/* El día cambiaba su color, las sombras comenzaban la invasión de todo. La mirada del hombre seguía la misma dirección que hace unas horas, abatido sobre la mesa del parque. Junto a él un cumulo de bolsas de plástico, conteniendo cualquier cosa. De pronto las recoge, con una cierta prisa. A llegado el momento de hacer su traslado, mete las bolsas en su carro de compra y va al camino de salida. Junto a él pasan corredores en busca de mantener o recuperar su forma física. Madres que vuelven con sus carritos de niño, llenas también de bolsas de plástico. Sigue el camino de salida, su paso es rígido. Sus ropas despiden un hedor, que nadie, vaya a la par de sus pasos. Nadie sabe donde vive, porque no tiene contacto con ninguna persona.
No se sabe los cambios, que hace en las diferentes calles, que se esfuma en el color gris que torna a negruzco. Y el ruido de su carro desaparece.
Mañana volverá a su banco preferido. De una de sus múltiples bolsas surgirá una barra de pan, un poco de embutido y la botella de agua que ha cogido en la fuente de arriba.
Curiosamente se ha aislado de la sociedad, pero utiliza.servicios de la comunidad, como la mesa banco, el agua y la comida. Cree no necesitar a nadie y nada, pero, sin embargo, sigue guardando en sus bolsas, cualquier cosa, desde ropa facilitada en la parroquia, hasta algún alimento envasado.
La teoría de no necesitar nada de nadie cuando hay una necesidad de muchas personas. La obcecación por no cambiar conductas y pensar que en el aislamiento estamos más protegidos.
El día cambiara pero nuestras neuronas se oxidaran y harán que el sistema mental se muestre más deteriorado. Este proceso sera degenerativo y sin retorno.



 ALEGRÍA



Llamaron a la puerta,
Putos niños, no tendrán otra cosa que hacer, sino molestar. Quien así habla, es un hombre mayor, muy huraño y  blanco de burlas de chicos y chicas.
Como la pescadilla que se muerde la cola. Él se va haciendo más arisco y los vecinos tratan de rehuirle pues siempre tiene palabras malsonantes.
Sus ropas cada vez son más avejentadas y de color oscuro.
Alguien llamo a su puerta. De mala manera vuelve a salir.
¿Qué quiere?
Buenos días, le venía a ofrecer.
No, necesito de nada, tengo de todo.
¿Seguro?
No estoy para perder el tiempo.
Su nombre es alegría
¿Y tu me la vas a ofrecer?
Si
¿A cambio de qué?
De una sonrisa
¿Crees que algo merece la pena?
Sino lo creyera no estaría hablando con usted.
No quiero perder el tiempo
¿El precio es tentador?
Se afana por ir cerrando la puerta poco a poco.
Me da dos minutos. Interrumpe el cierre.
¿Que cree que comen los ornitorrincos?
No estoy para tonterías.
Pero si para llaves.
¿Que dice?
Veo que me hace caso a algo que le digo. El gesto se vuelve interrogante.
Es que no te he entendido.
He dicho “si para llaves”
Y que tiene que ver eso con lo que estamos hablando.
Ha habido un cambio, ya estamos hablando. Pero las cebras pasan.
Otra tontería, ya surge una sonrisa en su cara.
Todo no es tan serio, lo podemos hacer más divertido.
La verdad es que cuesta.
Lo que realmente cuesta es tener la cara arrugada y el ceño fruncido.
Las circunstancias no ayudan, te aseguro.


LA NO ACCIÓN



La no acción es un síntoma de pasividad, pero cuando se lleva a gran escala resulta una forma de protesta, como hizo Ghandi en la India.
Siempre vemos, tener que enfrentarnos, a cosas o causas que están contra nosotros, o nuestra sociedad. Aquello que está mal “no podemos permitirlo” No nos damos cuenta que siempre que hay un enfrentamiento hay una perdida de energía que nos hace más débiles. Cuando nos enfrentamos estamos justificando nuestro pensamiento, pero eso no dice que sea, realmente, lo correcto.
No hay cosa que más irrite a una persona, la no respuesta a nuestra acción o comentario; por ello con la no acción conseguimos no desperdiciar nuestra energía, no ser participes de la violencia de las palabras o actos.
Los niños pequeños saben mucho de esto se enfrentan continuamente a indicaciones, para ellos, no comprendidas o entendidas. Los padres comentan que se desesperan ante estas actitudes (perdida de energía)
Se justifican aduciendo el cansancio que eso les provoca.
En las artes marciales se aprovecha la acción del atacante para utilizarla en su contra.
La primera premisa es<. mi realidad, mi verdad es solo mía, no es universal, cada persona tiene la suya. Entendiendo esta premisa nos damos cuenta que no debemos tratar de imponer nuestra verdad -realidad. Cada persona tiene su forma de ver las cosas, por ello comprendemos la pluralidad de los colores del arco iris. Todos son diferentes aunque todos son colores.
En un mundo conflictivo, cargado de acciones, rivalidades, competencias. Sería conveniente el cambiar los conceptos y aplicar lo contrario: la paz, la calma, la no acción.
Enseguida saltamos ante cualquier insinuación. Paremos, notemos nuestra respiración acompasada y no respondamos ante el acto de la imposición. Así, no se justifica, la acción de quien agrede. Sobra violencia aquí ya hay demasiada fuera.






 LA IMPOSICIÓN DE IDEAS


Aquel día se abrió con la noticia de una nueva matanza de personas que estaban en un mercado comprando los alimentos, para sus comidas
Una bolsa olvidada junto a unas cajas de fruta fue el detonante de la matanza. La necesidad de prevalecer nuestras ideas sobre las de los demás llega a ser tan fuerte que ciega a cualquiera, para no ver que con ello se puede desarrollar muerte o heridas, que no solo afectan a quien lo sufre sino a su grupo de allegados.
Necesidad de imposición de nuestras ideas, cueste lo que cueste y afecte a quien sabe quién. Da igual, se justifica que en una guerra no se distingue de personas. Solo de objetivos y los que están allí son un móvil valido para doblegar al enemigo.
Cuando vemos una película hacemos lo mismo; el objetivo es vencer, que más da, los que defienden lo otro, son parte de su causa, por tanto necesaria sus heridas o su muerte para vencer. Allí se ignora los sufrimientos personales, se justifican como una causa colateral necesaria para ganar.
Hemos sido educados en la cultura de ganar siempre, cueste lo que cueste y en base a estas sinrazones, se monta una filosofía que justifique los desmanes producidos por la necesidad de vencer.
La religión, el poder han sido quien han arado nuestras mentes para que nos mostremos como somos. Pero no olvidemos que los mismos son creaciones humanas. Son los móviles justificativos para pisar a quien sea necesario, para estar más alto. En torno a ello se montan unos pensamientos validos que reafirman los desmanes, aunque no haya donde cogerlo.
El mercado aparecerá lleno de dolor y de materiales destruidos, pero nunca se vera el triunfo, que justifique el dolor producido por unas ideas activadas en violencia sobre las personas.


EL PARTIDO


Fueron a jugar un partido de fútbol, pertenecían al mismo centro de trabajo. Difícil fue hacer los dos equipos, pues alguno no quería estar con otros compañeros, aunque parece que todo esta bien entre ellos.
Complicado fue buscar el día que a la gran mayoría les viniera bien.
La elección de campo no fue otra tarea fácil. Pero se logro.
Los menos activos figurarían en el papel de árbitros. Asiste hasta publico.
El balón comenzó a rodar, en busca de las redes de las porterías opuestas. El movimiento de jugadores empieza de una manera anacrónica. Se empieza a ver quien quiere dirigir al equipo. Estás decisiones chocan con los que se sienten opositores, la labor de equipo se merma. Algunos han adaptado su vestuario para coincidir las camisetas y los pantalones cortos. Si ya miramos las medias y el calzado ya la empresa se convierte en un arco iris.
La primera falta se llena de mucho sentimiento, más para vengar algún hecho del pasado que el de cortar una jugada. El agredido lo toma de esa manera y se revuelve hacía el agresor. Esto es el punto de partida de nuevos enfrentamientos que olvidan el objeto de poder hacer algo de deporte, reunidos unos compañeros para pasárlo bien. Se torna en un pugilato donde salen las tensiones guardadas. Se decide terminar el partido pero la discusión sigue en las duchas y seguramente seguirá los días sucesivos.
Quién había tenido la idea del partido tenía un sentido idílico que allí, se rompió y se convirtió en un lugar de terapia donde se sacaba todas las cosas que se tenían guardadas. Su ilusión fue rota y reprochado por haber tenido la idea. El no iba ser menos de critica y objeto de rabia.
El balón no se donde quedo. Triste reunión laboral.

EL VÉRTIGO DE LA MOSCA


Asomada a la estantería repleta de libros y papeles, se encuentra la mosca, con sus patas va recorriendo los diferentes libros que allí, se acumulan. Pero no embebe ninguno de ellos, sino que busca, en su periplo diario aquello susceptible de ser un alimento.
Las letras acumuladas no aportan nada a su necesidad de sustento diario, igual da, que sean tipográficas o de apuntes, ni que el papel pierda su color virginal por un matiz amarillento. Reforzado por haberse embebido el barniz de la estantería de madera maciza.
En la parte de arriba que es donde el polvo ha encontrado su lugar de acumulo, sin atreverse a despegar sus alas y buscar un nuevo sitio para explorar. Un repentino vértigo le ha llegado a ese cerebro. Atrapada en un espacio libre pero almenada por libros. Libre pero prisionera de este castillo.
No consigue que en ese deambule, consiga superar el miedo producido al aletear para alcanzar el traslado a un nuevo sitio.
La estantería se ha convertido en castillo, y eso a su vez en celda, donde la caída al suelo es el foso, infranqueable para quien no puede volar. A pesar de ser favorecida por los múltiples ocelos no consigue superar el fantasma del vértigo.
Algo ha pasado para al llegar donde ahora, esta, el sentirse prisionera y no poder utilizar sus alas.
Su soledad se agrava al observar el paso de los días y seguir en el castillo donde no puede descubrir los pensamientos acumulados entre aquellas letras. ¿que significaran? Pero su cerebro no razona nada, más que percibir unas manchas de tinta secas.
Sus múltiples ojos se encargan de la visión de una parcela del territorio, pero la integración de la totalidad, es una tarea más complicada, por ello la mosca sigue presa en este castillo, suyo.

LA LEJANÍA



Si observamos un paisaje vació de obstáculos, aquello que divisamos al fondo lo llamamos lejanía. Si la persona o cosa está en otra provincia lo decimos que esta lejos. Según la distancia entre una cosa u otra, lo podemos llamar lejos. Pero esta norma se rompe cuando compartimos una relación con otra persona y la sentimos en la lejanía.
A veces los elementos de medida, no bastan para dar cuenta del numero de metros o centímetros entre un objeto y otro. Si lo llevamos a relaciones personales, nos podemos perder, pues no nos indicara la realidad; pues resulta complicado, valorar la distancia entre las personas. Las barreras de las miradas y las posturas del cuerpo son tan significativas, que no hace falta medición, para ver la diferencia, entre ambos seres.
Si la lejanía indica posición remota; a veces, encontramos distancias del mismo tipo en las personas.
Asomados a la barandilla que separa la playa del mar, podemos contemplar un barco en la altonanza. Se mueve con una lentitud pasmosa y es difícil distinguir sus mástiles, dejamos la visión para distinguir el vuelo de una gaviota que no deja de graznar y requiere nuestra atención, hasta que una mosca se posa en nuestro brazo y no para de recorrerlo, con el consiguiente cosquilleo, hasta que nuestra atención se fija en ella y se mueve el brazo ejecutor en busca de la victima.
La persona que sentada a nuestro lado en el banco es ignorada y no requiere ni el más mínima atención, las palabras que han surgido hace unos instantes han sido lo suficiente claras que generan la sensación de lejanía, compartidas por ambas personas, el silencio es lo que constituye el metro que mide la distancia que existe entre ellos, como el barco en movimiento y a penas se ve.


 LA ESTACIÓN.
 La estación es un lugar de partida, pero también de encuentro, al menos así lo entienden las personas que allí halladas.
Hay diferencias con el pasado, cuando se emprendía un viaje, era una cosa extraordinaria y memorable. Hoy todo eso ha cambiado, es parte del día a día, en el caso de algunas personas, forma parte de su trabajo. Las despedidas y los recibimientos se hacen raros.
Caras grises y apuradas de tiempo, son los nuevos sustitutos. Las maletas voluminosas, donde tratabas de llevar lo más posible, son sustituidas por maletines portátiles donde llevar el ordenador o los pocos papeles necesarios para resolver las necesidades diarias. Eso si, lo que no puede faltar, es el teléfono móvil que sonara varias veces a lo largo del viaje.
Todo hace que las estaciones se hayan transformado y que sensaciones tenidas antes, ya no tengan cabida, ni en las paredes ni en los pasillos.
Los trenes también se han adaptado a los nuevos tiempos y se transforman en más rápidos. Dando más luz a unos vagones lúgubres, que campaban en el pasado.
Las conversaciones en los departamentos se han cambiado por las conversaciones telefónicas, ni siquiera la música ambiental puede tapar las mismas.
Los altavoces no solo anuncian las nuevas salidas o llegadas, sino medidas de seguridad, que te hacen mirar a la persona que pasa junto a ti, como una persona extraña, capaz de cometer un delito: Desconfiar.
El edificio vive la forma de vida transformada al tiempo actual.
Los periódicos son gratuitos, con noticias esquemáticas y un espacio para el ocio, cada vez más escaso.
Hay prisa, se corre para coger el nuevo transporte y es imposible dejar huella en este suelo de marmol. Las maletas tienen ruedas. Que aumentaran, de grosor, los fines de semana. Dando rapidez, al mundo acelerado.




 EL BAILE
 
El autobús se detiene en la parada destinada a ello, comienzan a subir un gran numero de personas, que esperan en la cola. En su mayoría son gente mayor, de la tercera edad, que nunca se sabe a que edad comienza, dependiendo de la edad del opinado, puede ser desde los cuarenta a los ochenta o más.
Al iniciar, su marcha, comienza el baile de cuerpos sujetos a las diferentes barras circundantes, dispuestas en todo el vehículo. Como los asientos ya venían ocupados pues hizo que un grupo de ancianos, fueran de pie.  Los diferentes frenazos y curvas agitan los cuerpos hacía uno u otro lado, con la consiguiente queja de los bailarines.
El grado de descontento fue subiendo en quejas a quien pilota el volante. Pero, él no puede prever los desenlaces de la circulación. Ante el semáforo en rojo, solicita bajarse.
- No estoy dispuesto que usted nos lleve como borregos.
- No es mi intención, son los avatares del día. Contesta el conductor.
- Aquí, no le puedo abrir, tiene que esperar a la próxima parada.
- No estoy dispuesto que juegue con mi vida, ni un metro más.
- Lo siento pero tengo unas normas que cumplir y no las voy a pasar.
El coro se hace mayor en defensa del que se encara, con gritos y palabras de animo al quejoso. El amotinamiento esta servido. Todo toma otro cariz.
Alguien llama por teléfono a la policía para denunciar que están secuestrados por el conductor donde van alojados.
Curiosamente la mayoría de los pasajeros, vienen de un baile de un centro de la tercera edad.
Los destellos azules vienen en gran numero delante del autobús. El chófer esta muy asustado ante el cariz de los acontecimientos están teniendo. Las voces se hacen gritos cada vez más.

La estación es un lugar de partida, pero también de encuentro, al menos así lo entienden las personas que allí halladas.
Hay diferencias con el pasado, cuando se emprendía un viaje, era una cosa extraordinaria y memorable. Hoy todo eso ha cambiado, es parte del día a día, en el caso de algunas personas, forma parte de su trabajo. Las despedidas y los recibimientos se hacen raros.
Caras grises y apuradas de tiempo, son los nuevos sustitutos. Las maletas voluminosas, donde tratabas de llevar lo más posible, son sustituidas por maletines portátiles donde llevar el ordenador o los pocos papeles necesarios para resolver las necesidades diarias. Eso si, lo que no puede faltar, es el teléfono móvil que sonara varias veces a lo largo del viaje.
Todo hace que las estaciones se hayan transformado y que sensaciones tenidas antes, ya no tengan cabida, ni en las paredes ni en los pasillos.
Los trenes también se han adaptado a los nuevos tiempos y se transforman en más rápidos. Dando más luz a unos vagones lúgubres, que campaban en el pasado.
Las conversaciones en los departamentos se han cambiado por las conversaciones telefónicas, ni siquiera la música ambiental puede tapar las mismas.
Los altavoces no solo anuncian las nuevas salidas o llegadas, sino medidas de seguridad, que te hacen mirar a la persona que pasa junto a ti, como una persona extraña, capaz de cometer un delito: Desconfiar.
El edificio vive la forma de vida transformada al tiempo actual.
Los periódicos son gratuitos, con noticias esquemáticas y un espacio para el ocio, cada vez más escaso.
Hay prisa, se corre para coger el nuevo transporte y es imposible dejar huella en este suelo de marmol. Las maletas tienen ruedas. Que aumentaran, de grosor, los fines de semana. Dando rapidez, al mundo acelerado.




 EL BAILE
 
El autobús se detiene en la parada destinada a ello, comienzan a subir un gran numero de personas, que esperan en la cola. En su mayoría son gente mayor, de la tercera edad, que nunca se sabe a que edad comienza, dependiendo de la edad del opinado, puede ser desde los cuarenta a los ochenta o más.
Al iniciar, su marcha, comienza el baile de cuerpos sujetos a las diferentes barras circundantes, dispuestas en todo el vehículo. Como los asientos ya venían ocupados pues hizo que un grupo de ancianos, fueran de pie.  Los diferentes frenazos y curvas agitan los cuerpos hacía uno u otro lado, con la consiguiente queja de los bailarines.
El grado de descontento fue subiendo en quejas a quien pilota el volante. Pero, él no puede prever los desenlaces de la circulación. Ante el semáforo en rojo, solicita bajarse.
- No estoy dispuesto que usted nos lleve como borregos.
- No es mi intención, son los avatares del día. Contesta el conductor.
- Aquí, no le puedo abrir, tiene que esperar a la próxima parada.
- No estoy dispuesto que juegue con mi vida, ni un metro más.
- Lo siento pero tengo unas normas que cumplir y no las voy a pasar.
El coro se hace mayor en defensa del que se encara, con gritos y palabras de animo al quejoso. El amotinamiento esta servido. Todo toma otro cariz.
Alguien llama por teléfono a la policía para denunciar que están secuestrados por el conductor donde van alojados.
Curiosamente la mayoría de los pasajeros, vienen de un baile de un centro de la tercera edad.
Los destellos azules vienen en gran numero delante del autobús. El chófer esta muy asustado ante el cariz de los acontecimientos están teniendo. Las voces se hacen gritos cada vez más.

La estación es un lugar de partida, pero también de encuentro, al menos así lo entienden las personas que allí halladas.
Hay diferencias con el pasado, cuando se emprendía un viaje, era una cosa extraordinaria y memorable. Hoy todo eso ha cambiado, es parte del día a día, en el caso de algunas personas, forma parte de su trabajo. Las despedidas y los recibimientos se hacen raros.
Caras grises y apuradas de tiempo, son los nuevos sustitutos. Las maletas voluminosas, donde tratabas de llevar lo más posible, son sustituidas por maletines portátiles donde llevar el ordenador o los pocos papeles necesarios para resolver las necesidades diarias. Eso si, lo que no puede faltar, es el teléfono móvil que sonara varias veces a lo largo del viaje.
Todo hace que las estaciones se hayan transformado y que sensaciones tenidas antes, ya no tengan cabida, ni en las paredes ni en los pasillos.
Los trenes también se han adaptado a los nuevos tiempos y se transforman en más rápidos. Dando más luz a unos vagones lúgubres, que campaban en el pasado.
Las conversaciones en los departamentos se han cambiado por las conversaciones telefónicas, ni siquiera la música ambiental puede tapar las mismas.
Los altavoces no solo anuncian las nuevas salidas o llegadas, sino medidas de seguridad, que te hacen mirar a la persona que pasa junto a ti, como una persona extraña, capaz de cometer un delito: Desconfiar.
El edificio vive la forma de vida transformada al tiempo actual.
Los periódicos son gratuitos, con noticias esquemáticas y un espacio para el ocio, cada vez más escaso.
Hay prisa, se corre para coger el nuevo transporte y es imposible dejar huella en este suelo de marmol. Las maletas tienen ruedas. Que aumentaran, de grosor, los fines de semana. Dando rapidez, al mundo acelerado.




 EL BAILE
 
El autobús se detiene en la parada destinada a ello, comienzan a subir un gran numero de personas, que esperan en la cola. En su mayoría son gente mayor, de la tercera edad, que nunca se sabe a que edad comienza, dependiendo de la edad del opinado, puede ser desde los cuarenta a los ochenta o más.
Al iniciar, su marcha, comienza el baile de cuerpos sujetos a las diferentes barras circundantes, dispuestas en todo el vehículo. Como los asientos ya venían ocupados pues hizo que un grupo de ancianos, fueran de pie.  Los diferentes frenazos y curvas agitan los cuerpos hacía uno u otro lado, con la consiguiente queja de los bailarines.
El grado de descontento fue subiendo en quejas a quien pilota el volante. Pero, él no puede prever los desenlaces de la circulación. Ante el semáforo en rojo, solicita bajarse.
- No estoy dispuesto que usted nos lleve como borregos.
- No es mi intención, son los avatares del día. Contesta el conductor.
- Aquí, no le puedo abrir, tiene que esperar a la próxima parada.
- No estoy dispuesto que juegue con mi vida, ni un metro más.
- Lo siento pero tengo unas normas que cumplir y no las voy a pasar.
El coro se hace mayor en defensa del que se encara, con gritos y palabras de animo al quejoso. El amotinamiento esta servido. Todo toma otro cariz.
Alguien llama por teléfono a la policía para denunciar que están secuestrados por el conductor donde van alojados.
Curiosamente la mayoría de los pasajeros, vienen de un baile de un centro de la tercera edad.
Los destellos azules vienen en gran numero delante del autobús. El chófer esta muy asustado ante el cariz de los acontecimientos están teniendo. Las voces se hacen gritos cada vez más.

La estación es un lugar de partida, pero también de encuentro, al menos así lo entienden las personas que allí halladas.
Hay diferencias con el pasado, cuando se emprendía un viaje, era una cosa extraordinaria y memorable. Hoy todo eso ha cambiado, es parte del día a día, en el caso de algunas personas, forma parte de su trabajo. Las despedidas y los recibimientos se hacen raros.
Caras grises y apuradas de tiempo, son los nuevos sustitutos. Las maletas voluminosas, donde tratabas de llevar lo más posible, son sustituidas por maletines portátiles donde llevar el ordenador o los pocos papeles necesarios para resolver las necesidades diarias. Eso si, lo que no puede faltar, es el teléfono móvil que sonara varias veces a lo largo del viaje.
Todo hace que las estaciones se hayan transformado y que sensaciones tenidas antes, ya no tengan cabida, ni en las paredes ni en los pasillos.
Los trenes también se han adaptado a los nuevos tiempos y se transforman en más rápidos. Dando más luz a unos vagones lúgubres, que campaban en el pasado.
Las conversaciones en los departamentos se han cambiado por las conversaciones telefónicas, ni siquiera la música ambiental puede tapar las mismas.
Los altavoces no solo anuncian las nuevas salidas o llegadas, sino medidas de seguridad, que te hacen mirar a la persona que pasa junto a ti, como una persona extraña, capaz de cometer un delito: Desconfiar.
El edificio vive la forma de vida transformada al tiempo actual.
Los periódicos son gratuitos, con noticias esquemáticas y un espacio para el ocio, cada vez más escaso.
Hay prisa, se corre para coger el nuevo transporte y es imposible dejar huella en este suelo de marmol. Las maletas tienen ruedas. Que aumentaran, de grosor, los fines de semana. Dando rapidez, al mundo acelerado.




 EL BAILE
 
El autobús se detiene en la parada destinada a ello, comienzan a subir un gran numero de personas, que esperan en la cola. En su mayoría son gente mayor, de la tercera edad, que nunca se sabe a que edad comienza, dependiendo de la edad del opinado, puede ser desde los cuarenta a los ochenta o más.
Al iniciar, su marcha, comienza el baile de cuerpos sujetos a las diferentes barras circundantes, dispuestas en todo el vehículo. Como los asientos ya venían ocupados pues hizo que un grupo de ancianos, fueran de pie.  Los diferentes frenazos y curvas agitan los cuerpos hacía uno u otro lado, con la consiguiente queja de los bailarines.
El grado de descontento fue subiendo en quejas a quien pilota el volante. Pero, él no puede prever los desenlaces de la circulación. Ante el semáforo en rojo, solicita bajarse.
- No estoy dispuesto que usted nos lleve como borregos.
- No es mi intención, son los avatares del día. Contesta el conductor.
- Aquí, no le puedo abrir, tiene que esperar a la próxima parada.
- No estoy dispuesto que juegue con mi vida, ni un metro más.
- Lo siento pero tengo unas normas que cumplir y no las voy a pasar.
El coro se hace mayor en defensa del que se encara, con gritos y palabras de animo al quejoso. El amotinamiento esta servido. Todo toma otro cariz.
Alguien llama por teléfono a la policía para denunciar que están secuestrados por el conductor donde van alojados.
Curiosamente la mayoría de los pasajeros, vienen de un baile de un centro de la tercera edad.
Los destellos azules vienen en gran numero delante del autobús. El chófer esta muy asustado ante el cariz de los acontecimientos están teniendo. Las voces se hacen gritos cada vez más.


*/