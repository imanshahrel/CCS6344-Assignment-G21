# CCS6344-Assignment-G21
Database and Cloud Security Assignment for Group 21

Steps to Launch the System:
1. Create a .env file in the server folder and insert these values:
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD= *insert your mysql password*
    DB_NAME=clinic_db
    JWT_SECRET= *insert any random long string*
    PORT=5001
2. Open a terminal in the root of the project folder
3. run: mysql -u root -p < database/schema.sql
4. enter your mysql password. then,
5. run: mysql -u root -p < database/seed.sql
6. enter your mysql password
7. Open a terminal in the server folder (make sure you have node.js downloaded into your device)
8. run: npm install
9. run: npm install express-rate-limit
10. run: npm run dev
11. Ensure terminal says "Server running on port 5001 MySQL Connected"
12. Open a terminal in the client folder
13. run: npm install
14. run: npm run dev
15. Ensure terminal gives a port/link to access the website
16. example: Local:   http://localhost:5173/
17. Paste link into your browser
18. Website is launched!
