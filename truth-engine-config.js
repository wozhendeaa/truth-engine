const imageTypes = '.jpg,.png,.gif,.jpeg,.webp';
const videoTypes = '.mp4,.mov,.avi';

module.exports = {
    appName: 'QTruthEngine',
    version: '1.0 Beta',
    system: {
        user: {
            sessionExpirationDuration: 1000 * 60 * 60 * 2 //2 hours
        }
    },
    uploadSetting :{
        roles: ['SHEEP', 'ENGIINE', 'VERYFIED_ENGINE', 'ADMIN'],
        imageTypes: '.jpg,.png,.gif,.jpeg,.webp',
        videoTypes: '.mp4,.mov,.avi,.mpeg',
        settings: [
            {
            role: 'SHEEP',
            maxPictures: 2,
            maxPictureSize: 300 * 1024,
            acceptType:  imageTypes,
            maxVideoSize: 0,
            },
            {
            role: 'ENGIINE',
            maxPictures: 5,
            maxPictureSize: 1 * 1024 * 1024,
            acceptType:  imageTypes + videoTypes,
            maxVideoSize: 50 * 1024 * 1024,
            },
            {
            role: 'VERYFIED_ENGINE',
            maxPictures: 5,
            maxPictureSize: 10 * 1024 * 1024,
            acceptType: imageTypes + videoTypes,
            maxVideoSize: 2 * 1024 * 1024 * 1024,
            },
            {
            role: 'ADMIN',
            maxPictures: 10,
            maxPictureSize: 10 * 1024 * 1024,
            acceptType:  imageTypes + videoTypes,
            maxVideoSize: 2 * 1024 * 1024 * 1024,
            },
            {
            role: 'ADMIN_VERYFIED_ENGINE',
            maxPictures: 20,
            maxPictureSize: 50 * 1024 * 1024,
            acceptType:  imageTypes + videoTypes,
            maxVideoSize: 20 * 1024 * 1024 * 1024,
            },
        ],
    }
  };
  