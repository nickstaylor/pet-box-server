const express = require('express');
const app = express();
const cors = require('cors')
app.use(express.static('public'))

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Pet Box';
app.get('/', (request, response) => {
  response.send('Oh hey Pet Box')
});

app.listen(app.get('port'), ()=> {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`)
});

app.use(express.json());
app.use(cors())

app.locals.pets = [
  { id: 'a1', name: 'Rover', type: 'dog' },
  { id: 'b2', name: 'Marcus Aurelius', type: 'parakeet' },
  { id: 'c3', name: 'Craisins', type: 'cat' }
];

app.locals.updatedPets = []


app.get('/api/v1/pets', (request, response) => {
  const pets = app.locals.pets
  // const updatedPets = app.locals.updatedPets
  response.json({pets})
});

app.get('/api/v1/pets/:id', (request, response) =>{
  const { id } = request.params
  const pet = app.locals.pets.find(pet => pet.id === id)
    if (!pet) {
      return response.sendStatus(404)
    }
  response.status(200).json(pet);
});


app.post('/api/v1/pets', (request, response)=>{
  const id = (Date.now().toString())
  const pet = request.body

  for (let requiredParameter of ['name', 'type']){
    if (!pet[requiredParameter]){
      return response
      .status(422)
      .send({ error: `Expected format: { name: <String>, type: <String> }. You're missing a ${requiredParameter} property.`})
    }
  }
  const { name, type } = pet;
  app.locals.pets.push({id, name, type});
  response.status(201).json({id, name, type})
})


app.get('/api/v1/updatedpets', (request, response) => {
const updatedPets = app.locals.updatedPets
if (!updatedPets.length){
  response.send({msg: 'Sorry, no pets have been updated yet.'})
} else {
  response.status(201).json({updatedPets})
}
})

app.patch('/api/v1/pets/:id', (request, response)=>{
  const { id } = request.params
  const found = app.locals.pets.some(pet=> pet.id === id)
  if (found){
  const updatedPet = request.body
  app.locals.pets.forEach(pet=> {
    if(pet.id === id){
      const udpatedPet =
      pet.name = updatedPet.name ? updatedPet.name : pet.name
      pet.type = updatedPet.type ? updatedPet.type : pet.type

      response.status(200).json({ msg: 'Pet Updated', pet})
      const newPet = {
        id: id,
        name: pet.name,
        type: pet.type
      }
      app.locals.updatedPets.push(newPet)
    }
  })
  } else {
      response.status(400).json({ msg: `No pet with the id of ${id}`})
    }

})

app.delete('/api/v1/pets/:id', (request, response) => {
  const { id } = request.params;
  const pets = app.locals.pets
  const pet = app.locals.pets.find(pet => pet.id === id.toString());
  if (!pet) {
    return response
.status(422)
.send({ error: `Something is wrong here!` });
}
  const index = pets.indexOf(pet);
 pets.splice(index, 1);
 response.status(201).json(pet);
})



app.get('/', (request, response)=>{

})
