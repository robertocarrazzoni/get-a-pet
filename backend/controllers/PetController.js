const Pet = require('../models/Pet')

//helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class PetController {

    //Create a pet
    static async create(req, res) {
        const {name, age, weight, color} = req.body


        const images = req.files

        const availabel = true

        //images upload

        //validations
        if(!name) {
            res.status(422).json({message: 'O nome é obrigatório'})
            return
        }

        if(!age) {
            res.status(422).json({message: 'A idade é obrigatório'})
            return
        }

        if(!weight) {
            res.status(422).json({message: 'O peso é obrigatório'})
            return
        }

        if(!color) {
            res.status(422).json({message: 'A cor é obrigatório'})
            return
        }

        if(images.length === 0) {
            res.status(422).json({message: 'A imagem é obrigatório'})
            return
        }

        //pet owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        //create a pet
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            availabel,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone
            }
        })

        images.map((image) => {
            pet.images.push(image.filename)
        })

        try {
            
            const newPet = await pet.save()
            res.status(201).json({
                message: 'Pet cadastrado com sucesso',
                newPet
        })

        } catch (error) {
            res.status(500).json({message: error})
        }

    }

    static async getAll(req, res) {
        
        const pets = await Pet.find().sort('-createdAt')

        res.status(200).json({ pets: pets})

    }

    static async getAllUserPets(req, res) {

        // get user from token
        const token = getToken(req)
        const user = await getUserByToken(token)
        
        const pets = await Pet.find({'user._id': user._id}).sort('-createdAt')

        res.status(200).json({pets})

    }

    static async getAllUserAdoptions(req, res) {

        // get user from token
        const token = getToken(req)
        const user = await getUserByToken(token)
        
        const pets = await Pet.find({'adopter._id': user._id}).sort('-createdAt')

        res.status(200).json({pets})

    }

    static async getPetById(req, res) {

        const id = req.params.id

        //check if id is valid
        if(!ObjectId.isValid(id)) {

            res.status(422).json({message: 'ID inválido'})
            return

        }


        //check if pet exists
        const pet = await Pet.findOne({_id: id})

        if (!pet) {
            
            res.status(404).json({message: 'Pet não encontrado'})
            return
        }

        res.status(200).json({
            pet: pet
        })

    }


    static async removePetById(req, res) {

        const id = req.params.id

        //check if id is valid
        if(!ObjectId.isValid(id)) {

            res.status(422).json({message: 'ID inválido'})
            return
        }
       
        //check if pet exists
        const pet = await Pet.findOne({_id: id})

        if (!pet) {
            
            res.status(404).json({message: 'Pet não encontrado'})
            return
        }

        //check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.toString() !== user._id.toString()) {
            
            res.status(422).json({
                message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde'
            })

        }

        await Pet.findByIdAndRemove(id)

        res.status(200).json({message: 'Removido com sucesso'})


    }

    static async updatePet(req, res) {

        const id = req.params.id

        const {name, age, weight, color, availabel} = req.body


        const images = req.files

        const updatedData = {}

        //check if id is valid
        if(!ObjectId.isValid(id)) {

            res.status(422).json({message: 'ID inválido'})
            return
        }

        //check if pet exists
        const pet = await Pet.findOne({_id: id})

        if (!pet) {
            
            res.status(404).json({message: 'Pet não encontrado'})
            return
        }

        //check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.toString() !== user._id.toString()) {
            
            res.status(422).json({
                message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde'
            })

        }

        //validations
        if(!name) {
            res.status(422).json({message: 'O nome é obrigatório'})
            return
        }else {
            updatedData.name = name
        }

        if(!age) {
            res.status(422).json({message: 'A idade é obrigatório'})
            return
        }else {
            updatedData.age = age
        }

        if(!weight) {
            res.status(422).json({message: 'O peso é obrigatório'})
            return
        }else {
            updatedData.weight = weight
        }

        if(!color) {
            res.status(422).json({message: 'A cor é obrigatório'})
            return
        }else {
            updatedData.color = color
        }

        if(images.length === 0) {
            res.status(422).json({message: 'A imagem é obrigatório'})
            return
        }else {
            updatedData.images = []
            images.map((image) => {
                updatedData.images.push(image.filename)
            })
        }

        await Pet.findByIdAndUpdate(id, updatedData)

        res.status(200).json({message: 'Pet atualizado com sucesso'})
    }

    static async schedule(req, res) {

        const id = req.params.id

        //check if pet exists
        const pet = await Pet.findOne({_id: id})

        if (!pet) {
            
            res.status(404).json({message: 'Pet não encontrado'})
            return
        }

        //check if the user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if (pet.user._id.equals(user._id)) {
            
            res.status(422).json({
                message: 'Você já é dono deste pet.'
            })
            return
        }

        //check if user already scheduled a visit
        if (pet.adopter) {
            if (pet.adopter._id.equals(user._id)) {
                res.status(422).json({
                    message: 'Você já agendou uma visita para este pet.'
                })
                return
            }
        }

        //add user to pet
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        }

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}`})
    }

    static async concludeAdoption(req, res) {

        const id = req.params.id

        //check if pet exists
        const pet = await Pet.findOne({_id: id})

        if (!pet) {
            
            res.status(404).json({message: 'Pet não encontrado'})
            return
        }

        
        //check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)
        
        if (pet.user._id.toString() !== user._id.toString()) {
            
            res.status(422).json({
                message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde'
            })
            
        }
        
        pet.availabel = false

        await Pet.findByIdAndUpdate(id, pet)

         res.status(200).json({message: 'Parbéns, o ciclo que adoção foi finalizado com sucesso'})
         
    }
}