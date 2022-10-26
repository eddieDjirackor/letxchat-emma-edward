// function solution(n) {
//     let arr = [];
//     for(let i = 1; i <= n; i++) {
//         if(i%3 === 0 && i%5 === 0) {
//             arr.push("FizzBuzz");
//          } else if (i%3 === 0) {
//              arr.push("Fizz");
//          } else if (i%5 === 0) {
//              arr.push("Buzz");
//          } else {
//             arr.push(i);
//          }
             
//          }
        
//         console.log(arr);
//     return arr;
// }

// solution(15);


// function solution(s) {
//     let vowels = [a, e, i, o, u];
//     let sum = 0;
//     let arr = s.split("");
//     for(i = 0; i < arr.length; i++) {
//         if(vowels.includes(arr[i])) {
//             sum += 1;
//         } else {
//             sum +=2;
//         }
//     }
    
//     return sum;
// }


function solution(arrays) {
    let arr = [];
    for(i = 0; i < arrays.length; i++) {
        arr.push(...arrays[i])
    }
    // let arr = [...arrays];
    console.log(arr);
    // return arr;
}

let arrays = [[1, 3, 5], [2, 3], [2, 3, 5, 8]]
solution(arrays);