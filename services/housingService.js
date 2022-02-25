const Housing = require('../models/housing')

exports.getAll = () => Housing.find().lean()

exports.getOne = (housingId) => Housing.findById(housingId).populate('tenants');

exports.create = (housingData) => Housing.create(housingData)

exports.getTopHouses = ()=>Housing.find().sort({createdAt: -1}).limit(3).lean(); // да се покажат последните три къщи на home page

exports.addTenant = async (housingId, tenantId)=>{
    return Housing.findOneAndUpdate(
        {_id: housingId},
        {$push: {tenants: tenantId},
        $inc: {availablePieces: -1},
    }, 
    {runValidators: true}
    );
}

exports.delete = (housingId) =>Housing.findByIdAndDelete(housingId);

exports.updateOne = (housingId, housingData) => Housing.findByIdAndUpdate(housingId, housingData);
exports.search = (text) => Housing.find({ type: text}).lean();