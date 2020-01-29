const router = require('express').Router({mergeParams: true});

const allPlanets = (req, res) => {
    var allPlanetsJSON = [
        {
          "id": 8606,
          "size": 3303, 
          "name": "Velasquez",
          "mass": 50313,
          "gravity": 40028,
          "composition": 98875
        },
        {
          "id": 3206,
          "size": 4298,
          "name": "Ortiz",
          "mass": 23503,
          "gravity": 71614,
          "composition": 21109
        },
        {
          "id": 763,
          "size": 10304043,
          "name": "Burch",
          "mass": 86507,
          "gravity": 29437,
          "composition": 38147
        },
        {
          "id": 4264,
          "size": 10000000,
          "name": "Malone",
          "mass": 65327,
          "gravity": 64307,
          "composition": 13911
        },
        {
          "id": 2315,
          "size": 23000,
          "name": "Joyce",
          "mass": 93577,
          "gravity": 12461,
          "composition": 29583
        }
    ];

    res.status(200).json(allPlanetsJSON); 
}

const allGalaxies = (req, res) => {
    var allGalaxiesJSON = [
        {
          "id": 3411,
          "name": "Evans",
          "numOfSystems": 2,
          "distanceToEarth": 990356
        },
        {
          "id": 3473,
          "name": "Luna",
          "numOfSystems": 112,
          "distanceToEarth": 704121
        },
        {
          "id": 2484,
          "name": "Caldwell",
          "numOfSystems": 58,
          "distanceToEarth": 610802
        },
        {
          "id": 3981,
          "name": "Whitley",
          "numOfSystems": 63,
          "distanceToEarth": 379185
        },
        {
          "id": 9157,
          "name": "Henry",
          "numOfSystems": 20,
          "distanceToEarth": 172517
        },
        {
          "id": 4292,
          "name": "Grimes",
          "numOfSystems": 72,
          "distanceToEarth": 969861
        }
    ];

    res.status(200).json(allGalaxiesJSON); 
}

const allSatellites = (req, res) => {
    var allSatellitesJSON = [{
        "id": 8510,
        "name": "Clemons",
        "mass": 69517659,
        "composition": 920522
      },
      {
        "id": 973,
        "name": "Hurley",
        "mass": 68897037,
        "composition": 447759
      },
      {
        "id": 9429,
        "name": "Gonzales",
        "mass": 16919018,
        "composition": 117329
      },
      {
        "id": 6066,
        "name": "Frye",
        "mass": 40020735,
        "composition": 696387
      },
      {
        "id": 4535,
        "name": "Donovan",
        "mass": 74560234,
        "composition": 241982
      },
      {
        "id": 2217,
        "name": "Merritt",
        "mass": 94938733,
        "composition": 478501
      },
      {
        "id": 459,
        "name": "Ochoa",
        "mass": 24414460,
        "composition": 734666
      }
    ]; 

    res.status(200).json(allSatellitesJSON); 
}

const allSystems = (req, res) => {
    var allSystemsJSON = [
        {
          "id": 6764,
          "name": "Brock",
          "numOfPlanets": 90704002,
          "numOfStars": 560154,
          "age": 32007568
        },
        {
          "id": 5790,
          "name": "Cantrell",
          "numOfPlanets": 25992974,
          "numOfStars": 198033,
          "age": 3366671
        },
        {
          "id": 1283,
          "name": "Hutchinson",
          "numOfPlanets": 70475935,
          "numOfStars": 463006,
          "age": 40950554
        },
        {
          "id": 4940,
          "name": "Whitaker",
          "numOfPlanets": 3004771,
          "numOfStars": 331480,
          "age": 65930232
        },
        {
          "id": 6014,
          "name": "Colon",
          "numOfPlanets": 28273337,
          "numOfStars": 118677,
          "age": 67475425
        },
        {
          "id": 4296,
          "name": "Wooten",
          "numOfPlanets": 56457504,
          "numOfStars": 268245,
          "age": 31509139
        },
        {
          "id": 4006,
          "name": "Stout",
          "numOfPlanets": 52595762,
          "numOfStars": 915258,
          "age": 58073008
        }
    ];

    res.status(200).json(allSystemsJSON); 
}

const allStars = (req, res) => {
    var allStarsJSON = [
        {
          "id": 2411,
          "name": "Browning",
          "distanceToEarth": 29375525,
          "gravity": 204795,
          "age": 96307147
        },
        {
          "id": 9692,
          "name": "Nguyen",
          "distanceToEarth": 9268695,
          "gravity": 177245,
          "age": 36834392
        },
        {
          "id": 4637,
          "name": "Shields",
          "distanceToEarth": 44148969,
          "gravity": 641514,
          "age": 66132914
        },
        {
          "id": 8703,
          "name": "Best",
          "distanceToEarth": 94193238,
          "gravity": 931165,
          "age": 14099506
        },
        {
          "id": 9972,
          "name": "Anderson",
          "distanceToEarth": 16808291,
          "gravity": 178062,
          "age": 39916193
        }
    ];

    res.status(200).json(allStarsJSON); 
}

router.get('/all_entities/planet/', (req, res) => allPlanets(req, res));
router.get('/all_entities/galaxy/', (req, res) => allGalaxies(req, res)); 
router.get('/all_entities/satellite/', (req, res) => allSatellites(req, res)); 
router.get('/all_entities/system/', (req, res) => allSystems(req, res)); 
router.get('/all_entities/star/', (req, res) => allStars(req, res)); 

module.exports = router; 
