import axios from 'axios';

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/products/scrape', {
      url: 'https://www.meesho.com/hoppup-xo3-gaming-earbuds-with-35ms-low-latency-13mm-drivers-50h-playtime-bluetooth-headset-white-true-wireless/p/6rupef'
    });
    console.log(JSON.stringify(res.data, null, 2));
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
  }
}

test();
