import { users } from '@/app/utils/db';
import { NextResponse } from 'next/server';
import fs from 'fs';

// 2. Get Specific User
export async function GET(_, res) {
  const { id } = await res.params;
  const user = users.filter((u) => u.id === id);
  return NextResponse.json({ user, ok: true });
}

// 3. Login
export async function POST(req, res) {
  let { name, email, password } = await req.json();
  const { id } = await res.params;

  const {
    name: uName,
    email: uEmail,
    password: uPassword,
  } = users.find((u) => u.id === id);

  if (uName === name && uEmail === email && uPassword === password) {
    return NextResponse.json({ result: 'successfully logged in' });
  } else if (!name || !email || !password) {
    return NextResponse.json({ result: 'Please fill all the input fields' });
  } else {
    return NextResponse.json({ result: 'invalid Credentials' });
  }
}

// 6. Delete User
export async function DELETE(req, res) {
  const { id } = await res.params;

  // Find the index of the user to delete in the users array
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return NextResponse.json({ result: 'User not found' }, { status: 404 });
  }

  // Remove the user from the users array
  users.splice(userIndex, 1);

  // Update the user data in the db.js file
  updateUserData();

  return NextResponse.json({ success: 'User Successfully Deleted' });
}

function updateUserData() {
  const updatedData = `export const users = ${JSON.stringify(users, null, 2)};`;
  fs.writeFileSync('./app/utils/db.js', updatedData, 'utf-8');
}
