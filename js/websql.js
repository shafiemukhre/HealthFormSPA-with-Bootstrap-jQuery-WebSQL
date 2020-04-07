//ref 1: SQL Database with Only HTML5 and Javascript by Computer Programming Arena https://www.youtube.com/watch?v=QExydkuuE30
//ref 2: Creating a very simple app with HTML, CSS & Javascript - Part 2/3 - Web SQL by Arhnuld https://www.youtube.com/watch?v=aJuGNkCetUE

const db=openDatabase("dbname","1.0","dbdesc",65535)
const canvas = document.getElementById('canvas')
const capture = document.getElementById('capture')

$(function(){   
    db.transaction(transaction => {
        let sql =  'CREATE TABLE IF NOT EXISTS demotable(id INTEGER NOT NULL, firstname VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL, gender VARCHAR(6) NOT NULL, age INT(3), details VARCHAR(255), PRIMARY KEY(id))'
        transaction.executeSql(sql,undefined, onSuccess, onError)

        let sql2 = 'CREATE TABLE IF NOT EXISTS healthtable(id INTEGER NOT NULL, height VARCHAR(255), weight INT, temp INT, pulse INT, bp INT, medications VARCHAR(255), notes VARCHAR(255), PRIMARY KEY(id))'
        transaction.executeSql(sql2,undefined, onSuccess, onError)

        let sql3 = 'CREATE TABLE IF NOT EXISTS phototable(id INTEGER NOT NULL, photo LONGBLOP, PRIMARY KEY(id))'
        transaction.executeSql(sql3,undefined, onSuccess, onError)
    })

    loaddata()

    //insert demographics data
    $('#savebtn1').click(()=>{
        let firstname = $('#firstname').val()
        let lastname = $('#lastname').val()
        let gender = $('#gender').val()
        let age = $('#age').val()
        let details = $.trim($('#details').val())
        db.transaction(transaction => {
            let sql = 'INSERT INTO demotable(firstname,lastname,gender,age, details) VALUES(?,?,?,?,?)'
            transaction.executeSql(sql,[firstname,lastname,gender,age,details], onSuccess, onError)
        })
    })

    //insert health vitals data
    $('#savebtn2').click(()=>{
        let height = $('#height').val()
        let weight = $('#weight').val()
        let temp = $('#temp').val()
        let pulse = $('#pulse').val()
        let bp = $('#bp').val()
        let medications = $.trim($('#medications').val())
        let notes = $.trim($('#notes').val())
        db.transaction(transaction => {
            let sql = 'INSERT INTO healthtable(height, weight, temp, pulse, bp, medications, notes) VALUES(?,?,?,?,?,?,?)'
            transaction.executeSql(sql,[height, weight, temp, pulse, bp, medications, notes], onSuccess, onError)
        })
        location.href="#reports"
        loaddata()
    })

    $('#capture').click(() => {
        canvas.getContext('2d').drawImage(photo, 0, 0, 150, 150)
        let dataURL = canvas.toDataURL()
        db.transaction(transaction => {
            let sql = 'INSERT INTO phototable(photo) VALUES(?)'
            transaction.executeSql(sql, [dataURL], onSuccess, onError)
        })
    })

    function onError(transaction, err){
        alert(`something went wrong ${err.message}`)
    }

    function onSuccess(transaction, err){
        // loaddata()
    }

    //to fetch
    function loaddata(){
        $('#datalist').children().remove()
        db.transaction( transaction =>{
            let sql = 'SELECT firstname, lastname, age, gender, photo, medications, notes FROM demotable INNER JOIN healthtable INNER JOIN phototable ON demotable.id = healthtable.id AND demotable.id = phototable.id ORDER BY demotable.id'
            transaction.executeSql(sql,undefined, (transaction, result)=>{
                    if(result.rows.length){
                        for(let i=0; i < result.rows.length; i++){
                            let row = result.rows.item(i)
                            let firstname = row.firstname
                            let lastname = row.lastname
                            let age = row.age
                            let gender = row.gender
                            let photoURL = row.photo
                            let medications = row.medications
                            let notes = row.notes
                            $('#datalist').append(`<tr><th scope="row">${firstname} ${lastname}</th><td>${age}</td><td>${gender}</td><td><img src="${photoURL}"></img></td><td>${medications}</td><td>${notes}</td></tr>`)
                        }
                    } else {
                        $('#datalist').append('<tr><th scope="row"></th></tr>')
                    }
            },(transaction, err)=>{
                alert(err.message)
            })
        })
    }
})