package com.inc.fcr;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseController {
    private static final String URL = "jdbc:mysql://127.0.0.1:3306/FCRDB";
    private static final String USER = "root";
    private static final String PASSWORD = "rentMyCar01#";

    private final Connection conn;

    public DatabaseController() throws SQLException {
        this.conn = DriverManager.getConnection(URL, USER, PASSWORD);
    }

    // Car Database Methods

    // Reservation Database Methods

    // Account Database Methods
}
