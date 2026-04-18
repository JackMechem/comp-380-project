package com.inc.fcr.reviews;

import com.inc.fcr.user.User;
import com.inc.fcr.car.Car;
import com.inc.fcr.errorHandling.ValidationException;

import com.inc.fcr.utils.APIEntity;
import com.inc.fcr.utils.DatabaseController;
import com.inc.fcr.utils.EntityController;
import jakarta.persistence.*;

import java.time.Instant;

//?
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reviews")

public class Reviews extends APIEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @OneToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user; // or long userid?
    //private long userid;

    private String comment;

    private String firstName; // is this needed or is the userId / user good enough? should it be account instead?

    @Column(nullable = false)
    private Instant timeDate;

    /*if(Instant dropOff != true) { don't bring to comment} everything after is code to leave comment*/ // sudo code based on "As a customer I would like to be able to easily leave a review on recent car rentals. After renting a car I should be prompted to leave a review upon returning to the site after returning the car"



    public Reviews() {
        this.comment = comment;
        //? name ?
        this.timeDate = timeDate;

    }

    //getters, setters



}
