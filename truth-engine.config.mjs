
export const truthConfig = {
    appName: 'QTruthEngine',
    version: '1.0 Beta',
    system: {
        user: {
            sessionExpirationDuration: 1000 * 60 * 60 * 24 //1 day
        }
    },
    userProfile :{
     
        upload :{
            roles: ['SHEEP', 'ENGIINE', 'VERYFIED_ENGINE', 'ADMIN'],
            settings: [
              {
                role: 'SHEEP',
                maxPictures: 2,
                maxPictureSize: 300 * 1024,
                canUploadVideos: false,
              },
              {
                role: 'ENGIINE',
                maxPictures: 5,
                maxPictureSize: 1 * 1024 * 1024,
                canUploadVideos: true,
                maxVideoSize: 50 * 1024 * 1024,
              },
              {
                role: 'VERYFIED_ENGINE',
                maxPictures: 5,
                maxPictureSize: 10 * 1024 * 1024,
                canUploadVideos: true,
                maxVideoSize: 2 * 1024 * 1024 * 1024,
              },
              {
                role: 'ADMIN',
                maxPictures: 7,
                maxPictureSize: 10 * 1024 * 1024,
                canUploadVideos: true,
                maxVideoSize: 2 * 1024 * 1024 * 1024,
              },
            ],
        }
    }
  };
  