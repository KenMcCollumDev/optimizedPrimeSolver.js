/*    
Purpose:
Quickly finds all the prime numbers in a given range, by ruling out as many numbers as I can from the division check.  Goal: to quickly find all the primes up to

Thinking: 
(1) look through only the known primes for divisors of each number (as all non primes will divide into primes) within the range up to the square root of the number (anything bigger than X^1/2 will have been eliminated by earlier checks for things that might multiply by it) (if Z = Y * X, then when I test Z /Y I am also testin Z / X at the same time, so by there is no need to test Z / Y for Y > Z^1/2...),
(2) don't check the even numbers at all (they all divide by 2; dont check any number ending in 5 (all divide by 5)
(3) each new prime is included in the known primes array to check against

Optimization Benefit:
Unoptimized N many candidates must be checked by M many possible divisors (N*N-2, since 1 and N need not be checked)
Optimized I can check N/2 numbers (skip the evens).  I need only check (0.0x*(N-2))^0.5 numbers (primes up to the square root)  
compare N*(N-2) against (N/2)*(0.0x*(N-2))^0.5.   ASSUMING about 1 in 20 numbers are prime (it seems smaller numbers have a greater proportion of primes), yields this chart of how many computations are required.

		    sum of  N*(N-2) from 2 up to N		     Sum of (.4*N)*(0.0559*(N-2))^0.5 from 3 up to N //.0559 at 1,000,000.  proportion decreases as the numbers get big + offsets the larger number of divisions per prime
Question:
Can this be multithreaded?
*/
var Module = (function () {
	var privateOptimizedLargePrimeSolver = function(rangeFirst, rangeLast){
		//console.log("flag 12: " + rangeFirst + ", " + rangeLast);
		var t0 = Date.now();
		var knownPrimesArray = [1,2,3,5,7]; /*will be [3,5,7,11,13 etc; can safely skip 1 and 2 as per below]  I could also import it from a file and skip checking for primes in (0,rangeFirst);*/
		var divisionsCount = 0;
		var arraySearchStart = 0;
		var knownPrimesLimit = 0;
		var knownPrimesArrayLength = 0;
		if(rangeFirst < 11)
			{ 
			rangeFirst = 11; /*to start the for loop at an odd number*/
			}
		/*Im already skipping the evens and 1 * a thing is just that thing*/
		for( var rangeRover = rangeFirst; rangeRover <= rangeLast; rangeRover = rangeRover + 2){  //skip all even numbers (divisible by 2)
		//console.log("Flag1: rangeRover: " + rangeRover + " rangeRover.toString()[rangeRover.toString().length-1] givces remainder, " + rangeRover.toString()[rangeRover.toString().length-1] +", knownPrimesArray " + knownPrimesArray);
		// loop through the user specified ramge
			if (rangeRover.toString()[rangeRover.toString().length-1] != 5)
				{
				//skip any number ending in 5: it is divisible by 5.  no need to skip number ending in zero (also divisble by 5) because they were already skipped as even number			
	// i need to write a function to find the array index of the known prime less than Math.pow(rangeRover,0.5)
				knownPrimesArrayLength = knownPrimesArray.length;
				for (var arrayCounter = arraySearchStart; arrayCounter <= knownPrimesArrayLength; arrayCounter++)
					{
						if(knownPrimesArray[arrayCounter] >= Math.pow(rangeRover,0.5))
							{		
								knownPrimesLimit = arrayCounter;
								arraySearchStart = arrayCounter;
								//console.log("knownPrimesLimit" + knownPrimesLimit);
								break;
							}
					}
				for( var knownPrimesCounter = 2; knownPrimesCounter <= knownPrimesLimit; knownPrimesCounter++ )
					{ 
						// check for prime factors (primeCounter) only up to the square root of the number to be checked to see if its prime (rangeRover)
						//start checking after 1 and 2 to skip division by them
						//console.log("Flag2: knownPrimeCounter: " + knownPrimesCounter + ", rangeRover % knownPrimesArray[knownPrimesCounter] " + rangeRover % knownPrimesArray[knownPrimesCounter]);
						//check each odd number in the range for divisibility by the kmown primes
						divisionsCount ++; 
						//console.log("Divisions Count: " + divisionsCount);
						if(rangeRover % knownPrimesArray[knownPrimesCounter] == 0){
							//console.log("Flag3A: " + rangeRover + "isnt prime.  it is evenly divisible by at least the number" + knownPrimesArray[knownPrimesCounter]);
							knownPrimesCounter = rangeRover; /* once a divisor is found, move on to the next cadidate.  can't use break.  it will just put me back into the knownPrimes Loop */								
							}
		 					else if (knownPrimesCounter == knownPrimesLimit)
							{
								//console.log("Flag3B: rangeRover is prime: " + rangeRover);
								/*@ add the found primes to the known primes array and skip the factorable #s.  create new element at [length] */
								knownPrimesArray[knownPrimesArrayLength] = rangeRover;
								//console.log("Flag 3C: knownPrimesArray: " + knownPrimesArray);
							}		
					}   //closes Known Primes loop.  if none of the knowm primes factor evenly into the candidate then it is prime.
			}//closes skip 5s if
		}/*closes search Range for loop*/
		var t1 = Date.now();
		//suppressed output of the found primes array because it took too long to console.log the array...  
		//@todo: how to write it to a file?
		console.log("Flag 4: knownPrimesArray: " + knownPrimesArray)
		//console.log("Flag 4: knownPrimesArray - final 2: " + knownPrimesArray[knownPrimesArray.length -2] + ", " + knownPrimesArray[knownPrimesArray.length -1]);
		var t2 = Date.now();
		//knownPrimesArrayLength++; //don't count 1 as a prime number
		console.log("Execution Time: " + (t1 - t0)/1000);
		console.log("Display Time: " + (t2 - t1)/1000);
		console.log("Count of Found Primes: " + knownPrimesArrayLength);
		console.log("Divisions Count: " + divisionsCount);
		return knownPrimesArray;
	}//closes function

/*
  var optimizedLargePrimeSolver = function (rangeFirst, rangeLast) {
	console.log("flag 1: " + this)
	privateOptimizedLargePrimeSolver(rangeFirst, rangeLast);
  };
*/
	
	var primesCommandLineInterface = function(){
		var rangeFirst = 1;
		var readline = require('readline');
		var readLineInterface = readline.createInterface({
		    input: process.stdin,
		    output: process.stdout
		    });
    	console.log("                    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX \n                    X                                          X \n                    X                                          X \n                    X  Ken's Optimized Prime Solver v0.2.06    X \n                    X                                          X \n                    X  Ken McCollum 2017-06-29                 X \n                    X                                          X \n                    X                                          X \n                    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX \n");
	
	readLineInterface.question("Up to what number shall I find primes?\n(Note: expected times: \n10million: 2seconds\n100million: 69seconds\n1billion: 32minutes\n >> $", function(rangeLast) 
	{  
		console.log("Now finding all primes up to " + rangeLast + "  .  Please be patient.");
		privateOptimizedLargePrimeSolver(rangeFirst, rangeLast);
		readLineInterface.close();
	});

	}

  	return {
    //optimizedLargePrimeSolver: optimizedLargePrimeSolver
	primesCommandLineInterface: primesCommandLineInterface
  };
})();


//@todo: array push?
//@todo: line breaks for WYSIWYG display in code of the CLI


Module.primesCommandLineInterface();







