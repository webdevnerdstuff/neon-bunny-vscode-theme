// Define a custom interface for a person
interface Person {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
}

// Define a class that implements the Person interface
class Employee implements Person {
  constructor(public firstName: string, public lastName: string, public age: number, public gender: string, public id: number) { }

  // Define a method that returns the full name of the employee
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Define a static method that creates a new employee object from a plain object
  static create(obj: Partial<Employee>): Employee {
    const { firstName, lastName, age, gender, id } = obj;
    return new Employee(firstName, lastName, age, gender, id);
  }
}

// Define an array of employee objects
const employees: Employee[] = [
  new Employee("John", "Doe", 30, "Male", 1),
  new Employee("Jane", "Doe", 25, "Female", 2),
  new Employee("Bob", "Smith", 35, "Male", 3),
];

// Define a function that takes an array of employees and returns the average age of male employees
function getAverageMaleAge(employees: Employee[]): number {
  const maleEmployees = employees.filter((employee) => employee.gender === "Male");
  const totalAge = maleEmployees.reduce((sum, employee) => sum + employee.age, 0);
  return totalAge / maleEmployees.length;
}

// Call the getAverageMaleAge function and log the result to the console
console.log(`Average male age: ${getAverageMaleAge(employees)}`);

// Create a new employee object from a plain object using the static create method
const newEmployee = Employee.create({ firstName: "Alice", lastName: "Smith", age: 27, gender: "Female", id: 4 });

// Log the full name of the new employee to the console
console.log(`New employee's full name: ${newEmployee.getFullName()}`);
