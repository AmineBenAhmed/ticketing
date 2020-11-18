export const natsWrapper = {
  client: {
    // publish: (subject: string, data: string, callback: () => void) => {
    //   callback();
    // } => the fake implementation will tell jest only we have this function with those parameters but but we ca not use it for test it con not make expectation around it therefore we use a mocked function
    publish: jest
              .fn()//this is a mock function we can use it for test and expect results it can be executed or expect some result from particular argument
              .mockImplementation(//the mockImplementation used for custom implementation
                (subject: string, data: string, callback: () => void) => { 
                  callback();
              })
            }
}