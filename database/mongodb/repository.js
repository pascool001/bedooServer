
const models = require('./model')
// const User = require('./model/User.model')

// const resultFormat = (err=true, data=null) => {
//     return {err, data}
// }


module.exports = (modelName) => {

    const model = models[modelName]

    return {

        Create: async (data) => {
            
            try {
                const instance = new model(data);
                const result = await instance.save()
                return result
                // return resultFormat(false, result)
            } catch (error) {
                console.log('Error  : ', error.message)
                // return resultFormat(true, null)
            }
        },
    
        Update: async (data, id) => {
            try {
                await model.findByIdAndUpdate(id, {...data});
                const result = await model.findById(id);
                return result
                // return resultFormat(false, result)
            } catch (error) {
                console.log('Error  : ', error.message)
                // return resultFormat(true, null)
            }
        },
    
        GetById: async (id) => {
            try {
                const result = await model.findById(id);
                return result
                // return resultFormat(false, result)
            } catch (error) {
                console.log('Error  : ', error.message)
                // return resultFormat(true, null)
            }
        },
        // -----------------------------specifique à User ---------------------------------
        GetByEmail: async (email) => {
            try {
                const result = await model.findOne({email});
                return result
                // return resultFormat(false, result)
            } catch (error) {
                console.log('Error  : ', error.message)
                // return resultFormat(true, null)
            }
        },
        // -----------------------------specifique à Token model ---------------------------------
        FindTokenByUserId: async (userId) => {
            try {
                const result = await model.findOne({userId});
                return result
                // return resultFormat(false, result)
            } catch (error) {
                console.log('Error  : ', error.message)
                // return resultFormat(true, null)
            }
        },
    // ===============================================================================
    
        getAll: async () => {
            try {
                const result = await model.find({});
                return result
                // return resultFormat(false, result)
            } catch (error) {
                console.log('Error  : ', error.message)
                // return resultFormat(true, null)
            }
        },
    
        remove: async (id) => {
            try {
                const result = await model.findByIdAndDelete(id);
                return result
                // return resultFormat(false, result)
            } catch (error) {
                console.log('Error  : ', error.message)
                // return resultFormat(true, null)
            }
        }

    }
    

}
