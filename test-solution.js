
// Task: Implement a 'Range Collection' class.
// A pair of integers define a range, for example: [1, 5). This range includes integers: 1, 2, 3, and 4.
// A range collection is an aggregate of these ranges: [1, 5), [10, 11), [100, 201)

/**
 * RangeCollection class
 * NOTE: Feel free to add any extra member variables/functions you like.
 */
class RangeCollection {
    constructor() {
        //A flat sorted list of pairs.  Even index numbers are for the start and odds are for ends
        this.pairs = []; 
      }
    /**
     * Adds a range to the collection
     * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
     */
    add(range) {
        if (range.length !== 2 || range[0] > range[1]){
            throw "Invalid range";
        }
        let insertionIndex = 0;
        let numberOfRemovedItems = 0;
        let newPair = range;
        const rangeMin = range[0];
        const rangeMax = range[1];
        if (this.pairs.length) {
            
            //find the first index that range could fit in (either by having rangeMin between a pair's bounds of by having the next/previous pair exactly 1 integer appart)
            let firstIndex = -1;
            for (let i = 0; i < this.pairs.length && firstIndex === -1; i = i + 2) {
                if ((rangeMin < this.pairs[i] && rangeMax > this.pairs[i+1]) ||
                    (rangeMin >= this.pairs[i] && rangeMin <= this.pairs[i+1]) ||
                    (rangeMin === this.pairs[i+1] + 1)) {
                    firstIndex = i;
                }
            }
            let lastIndex = -1;
            for (let i = this.pairs.length - 2; i >= 0 && lastIndex === -1; i = i - 2) {
                if ((rangeMin < this.pairs[i] && rangeMax > this.pairs[i+1]) ||
                    (rangeMax >= this.pairs[i] && rangeMax <= this.pairs[i+1]) ||
                    (rangeMax === this.pairs[i] - 1)) {
                    lastIndex = i;
                }
            }
            
            if (firstIndex === -1 && lastIndex == -1) {
                //insert it at the end if it's bigger than the last integer otherwise at the beginning
                insertionIndex = rangeMin > this.pairs[this.pairs.length-1] ? this.pairs.length : 0;
                firstIndex
                numberOfRemovedItems = 0;
            } else if (firstIndex === -1){
                firstIndex = lastIndex;
                insertionIndex = lastIndex;
                numberOfRemovedItems = 2;
            } else if (lastIndex === -1){
                lastIndex = firstIndex;
                insertionIndex = firstIndex;
                numberOfRemovedItems = 2;
            } else {
                insertionIndex = firstIndex;
                numberOfRemovedItems = lastIndex - firstIndex + 2;
            }
            newPair = [firstIndex > -1 ? Math.min(this.pairs[firstIndex], rangeMin) : rangeMin, 
                       lastIndex > -1 ? Math.max(this.pairs[lastIndex + 1], rangeMax) : rangeMax];
        }
        this.pairs.splice(insertionIndex, numberOfRemovedItems, ...newPair);
    }
  
    /**
     * Removes a range from the collection
     * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
     */
    remove(range) {
        if (range.length !== 2 || range[0] > range[1]){
            throw "Invalid range";
        }
        const rangeMin = range[0];
        const rangeMax = range[1];
            
        //find the first index that remove will impact
        let firstIndex = -1;
        for (let i = 0; i < this.pairs.length && firstIndex === -1; i = i + 2) {
            if ((rangeMin < this.pairs[i] && rangeMax > this.pairs[i+1]) ||
                (rangeMin > this.pairs[i] && rangeMin < this.pairs[i+1])) {
                firstIndex = i;
            }
        }
        let lastIndex = -1;
        for (let i = this.pairs.length - 2; i >= 0 && lastIndex === -1; i = i - 2) {
            if ((rangeMin < this.pairs[i] && rangeMax > this.pairs[i+1]) ||
                (rangeMax > this.pairs[i] && rangeMax < this.pairs[i+1])) {
                lastIndex = i;
            }
        }
        if (firstIndex === -1 && lastIndex == -1) {
            //nothing to delete: possibly raise an error
        } else if (firstIndex === -1){
            this.pairs[lastIndex] = rangeMax;
        } else if (lastIndex === -1){
            this.pairs[firstIndex+1] = rangeMin;
        } else  {
            if (this.pairs[firstIndex] < rangeMin && rangeMax < this.pairs[lastIndex+1]) {
                this.pairs.splice(firstIndex, lastIndex - firstIndex + 2, this.pairs[firstIndex], rangeMin, rangeMax, this.pairs[lastIndex+1]);
            } else {
                this.pairs.splice(firstIndex, lastIndex - firstIndex + 2);
            }
        }
    }
  
    stringify() {
        const results = [];
        for (let i = 0; i < this.pairs.length; i = i + 2) {
          results.push(`[${this.pairs[i]}, ${this.pairs[i+1]})`)
        }
        return results.join(' ');
    }
    /**
     * Prints out the list of ranges in the range collection
     */
    print() {
       console.log(this.stringify());
    }
  }
  
  // Example run
  const rc = new RangeCollection();
  
  rc.add([1, 5]);
  //console.log(rc.stringify() === "[1, 5)")
  rc.print();
  // Should display: [1, 5)
  
  rc.add([10, 20]);
  //console.log(rc.stringify() === "[1, 5) [10, 20)")
  rc.print();
  // Should display: [1, 5) [10, 20)
  
  rc.add([20, 20]);
  //console.log(rc.stringify() === "[1, 5) [10, 20)")
  rc.print();
  // Should display: [1, 5) [10, 20)
  
  rc.add([20, 21]);
  //console.log(rc.stringify() === "[1, 5) [10, 21)")
  rc.print();
  // Should display: [1, 5) [10, 21)
  
  rc.add([2, 4]);
  //console.log(rc.stringify() === "[1, 5) [10, 21)")
  rc.print();
  // Should display: [1, 5) [10, 21)
  
  rc.add([3, 8]);
  //console.log(rc.stringify() === "[1, 8) [10, 21)")
  rc.print();
  // Should display: [1, 8) [10, 21)
  
  ////////////////////////////////////////Added: these cases were not tested
  rc.add([9, 9]);
  //console.log(rc.stringify() === "[1, 21)")
  rc.print();

  rc.remove([8, 10]);
  //console.log(rc.stringify() === "[1, 8) [10, 21)")
  rc.print();
  ////////////////////////////////////////End
  

  rc.remove([10, 10]);
  //console.log(rc.stringify() === "[1, 8) [10, 21)")
  rc.print();
  // Should display: [1, 8) [10, 21)
  
  rc.remove([10, 11]);
  //console.log(rc.stringify() === "[1, 8) [11, 21)")
  rc.print();
  // Should display: [1, 8) [11, 21)
  
  rc.remove([15, 17]);
  //console.log(rc.stringify() === "[1, 8) [11, 15) [17, 21)")
  rc.print();
  // Should display: [1, 8) [11, 15) [17, 21)
  
  rc.remove([3, 19]);
  //console.log(rc.stringify() === "[1, 3) [19, 21)")
  rc.print();
  // Should display: [1, 3) [19, 21)


  ////////////////////////////////////////Added: these cases were not tested
  rc.add([0, 22]);
  //console.log(rc.stringify() === "[0, 22)")
  rc.print();

  rc.remove([25, 27]);
  //console.log(rc.stringify() === "[0, 22)")
  rc.print();

  rc.remove([-5, 27]);
  //console.log(rc.stringify() === "")
  rc.print();
  ////////////////////////////////////////End  

//   try {
//     rc.remove([2, 1]);
//     console.log(false);
//    } catch (err) {
//       console.log(true);
//   }

//   try {
//     rc.add([2]);
//     console.log(false);
//    } catch (err) {
//       console.log(true);
//   }
