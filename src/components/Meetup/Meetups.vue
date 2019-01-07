<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                <v-card class="info">
                    <v-container fluid>
                        <v-layout row>
                            <v-flex xs5 sm4 md3>
                                <v-img
                                src="https://media.timeout.com/images/104692494/image.jpg"
                                height="130px"
                                >

                                </v-img>
                            </v-flex>
                            <v-flex xs7 sm8 md9>
                                 <v-card-title primary-title>
                                     <div>
                <h1 class="white--text" mb-0>My meetup</h1>
                <div>17th of July 2019</div>

                                     </div>
              </v-card-title>
              <v-card-actions>
                <v-btn flat to="/meetups/1">
                    <v-icon left light>arrow_forward</v-icon>
                    View meetups</v-btn>
              </v-card-actions>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>