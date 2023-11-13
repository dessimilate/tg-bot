export interface ISchedule {
  course: string
  schedule: {
    odd: { [key: string]: string[][] }
    even: { [key: string]: string[][] }
  }
}