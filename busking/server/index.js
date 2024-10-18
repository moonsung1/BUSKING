const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MySQL 연결 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '!q1w2e3r4', // 비밀번호는 환경변수로 관리하는 것이 좋습니다
  database: 'addresses', // 데이터베이스 이름
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected...');
});

// 주소 추가 API
app.post('/api/addresses', (req, res) => {
    const addresses = req.body; // 클라이언트에서 전달한 주소 배열
    const sql = 'INSERT INTO addresses (lat, lng, value) VALUES ?';
    
    // 배열 형태의 데이터로 변환
    const values = addresses.map(address => [address.lat, address.lng, address.value]);
  
    db.query(sql, [values], (err, result) => {
      if (err) {
        console.error('주소 추가 실패:', err);
        return res.status(500).send('서버 오류');
      }
      
      // 새로 추가된 주소 정보를 배열 형태로 응답
      const addedAddresses = result.affectedRows > 0 ? values.map((val, index) => ({
        id: result.insertId + index, // 추가된 ID를 설정
        lat: val[0],
        lng: val[1],
        value: val[2],
      })) : [];
      
      res.status(201).send(addedAddresses);
    });
  });
  

// 주소 가져오기 API
app.get('/api/addresses', (req, res) => {
  const sql = 'SELECT * FROM addresses';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('주소 가져오기 실패:', err);
      return res.status(500).send('서버 오류');
    }
    res.send(results);
  });
});

// 주소 삭제 API
app.delete('/api/addresses/:id', (req, res) => {
  const sql = 'DELETE FROM addresses WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error('주소 삭제 실패:', err);
      return res.status(500).send('서버 오류');
    }
    res.sendStatus(204); // 성공적으로 삭제됨
  });
});

// 서버 시작
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
